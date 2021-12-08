//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IChessNFT.sol";
import "./interfaces/IChessLogic.sol";
import "./interfaces/IElo.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ChessGame is Ownable {
	address private _masterContract;

	modifier onlyMaster() {
		require(_masterContract == msg.sender, "Function only for Core contract!");
		_;
	}

	function changeMaster(address newMaster) public onlyOwner {
		_masterContract = newMaster;
	}

	IERC20 public chessToken;
	IChessNFT public chessNFT;
	IChessLogic public chessLogic;
	IElo public elo;
	using ECDSA for bytes32;

	uint32 constant initial_white_state = 0x000704ff;
	uint32 constant initial_black_state = 0x383f3cff;
	uint256 constant game_state_start =
		0xcbaedabc99999999000000000000000000000000000000001111111143265234;

	struct Game {
		address white;
		address whiteProxy;
		uint32 whiteState;
		address black;
		address blackProxy;
		uint32 blackState;
		uint8 status;
		uint8 outcome;
		bool startingTurnBlack;
		uint256 gameState;
		bytes32 ipfsHash;
	}

	mapping(address => uint256) public stakedBalance;
	mapping(uint256 => Game) games;
	uint256 bet;
	uint256 fee;
	uint256 NFTfee;

	constructor(
		address _chessToken,
		address _chessNFT,
		address _chessLogic,
		address _elo
	) {
		chessToken = IERC20(_chessToken);
		chessNFT = IChessNFT(_chessNFT);
		chessLogic = IChessLogic(_chessLogic);
		elo = IElo(_elo);
		bet = 10**19;
		fee = 10**18;
		NFTfee = 5 * 10**18;
	}

	function getBetAmount() public view returns (uint256) {
		return bet;
	}

	function changeBet(uint256 _bet) public onlyOwner {
		bet = _bet;
	}

	function changeFee(uint256 _fee) public onlyOwner {
		fee = _fee;
	}

	function changeNFTFee(uint256 _fee) public onlyOwner {
		NFTfee = _fee;
	}

	function getStakedBalance(address _player) public view returns (uint256) {
		return stakedBalance[_player];
	}

	function stake(uint256 _amount) external {
		require(
			chessToken.transferFrom(msg.sender, address(this), _amount),
			"Not enough tokens"
		);
		stakedBalance[msg.sender] = _amount;
	}

	function unstake(uint256 _amount) external {
		uint256 balance = stakedBalance[msg.sender];
		require(balance >= _amount, "Not enough tokens to unstake");
		stakedBalance[msg.sender] = balance - _amount;
	}

	// function createGame

	function StartGame(
		uint256 _gameId,
		address _white,
		address _whiteProxy,
		bytes memory _whiteSig,
		address _black,
		address _blackProxy,
		bytes memory _blackSig
	) public {
		// Check and reduce staked balance
		require(
			keccak256(abi.encode(_gameId, _whiteProxy))
				.toEthSignedMessageHash()
				.recover(_whiteSig) == _white
		);
		require(
			keccak256(abi.encode(_gameId, _blackProxy))
				.toEthSignedMessageHash()
				.recover(_blackSig) == _black
		);
		require(games[_gameId].status == 0, "Game already started");
		uint256 white_balance = stakedBalance[_white];
		uint256 black_balance = stakedBalance[_black];

		require(white_balance >= bet, "Not enough tokens for white");
		require(black_balance >= bet, "Not enough tokens for black");

		stakedBalance[_white] = white_balance - bet;
		stakedBalance[_black] = black_balance - bet;

		games[_gameId] = Game(
			_white,
			_whiteProxy,
			initial_white_state,
			_black,
			_blackProxy,
			initial_black_state,
			1,
			0,
			false,
			game_state_start,
			bytes32(0)
		);
	}

	function endGame(
		uint256 _gameId,
		uint256 _gameState,
		uint32 _whiteState,
		uint32 _blackState,
		uint16 _move,
		bytes memory signature,
		bytes32 ipfsHash,
		bool turnBlack
	) public {
		Game memory game = games[_gameId];
		require(game.status == 1, "Game ended");
		IChessLogic.Board memory board;
		{
			address signer;
			if (turnBlack) {
				signer = game.whiteProxy;
				board = IChessLogic.Board(
					_gameState,
					game.blackState,
					game.whiteState,
					true
				);
			} else {
				signer = game.blackProxy;
				board = IChessLogic.Board(
					_gameState,
					game.whiteState,
					game.blackState,
					false
				);
			}

			require(
				keccak256(
					abi.encode("CHESS", _gameId, _gameState, _whiteState, _blackState)
				).recover(signature) == signer,
				"Signature does not match"
			);
		}
		uint8 outcome;
		{
			(outcome, board) = chessLogic.verifyGame(board, _move);
		}
		require(outcome > 0, "Outcome must be conclusive");

		Game storage gs = games[_gameId];
		gs.status = 2;
		gs.gameState = board.gameState;
		gs.startingTurnBlack = board.turnBlack;
		gs.outcome = outcome;
		if (board.turnBlack == false) {
			gs.whiteState = board.playerState;
			gs.blackState = board.opponentState;
		} else {
			gs.whiteState = board.opponentState;
			gs.blackState = board.playerState;
		}
		elo.recordResult(game.white, game.black, outcome);
		address winner;
		if (outcome == 1) {
			stakedBalance[game.white] += bet;
			stakedBalance[game.black] += bet;
			return;
		}
		if (outcome == 2) {
			winner = game.white;
		} else if (outcome == 3) {
			winner = game.black;
		}
		if (ipfsHash != bytes32(0) && winner != address(0)) {
			gs.ipfsHash = ipfsHash;
			chessNFT.mint(winner, uint256(ipfsHash), 1, "");
			stakedBalance[winner] += bet + bet - fee - NFTfee;
		} else stakedBalance[winner] += bet + bet - fee;
	}
}
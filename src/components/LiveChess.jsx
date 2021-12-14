import { useEffect, useState, useMemo } from "react";
import {
	useMoralisQuery,
	useMoralisCloudFunction,
	useMoralis,
} from "react-moralis";
import { useWindowSize } from "../hooks/useWindowSize";
import useBoardWidth from "../hooks/useBoardWidth";
import { Modal, Button } from "antd";

import TabView from "./views/TabView";
import MobileView from "./views/MobileView";
import DesktopView from "./views/DesktopView";

import "../styles/game.scss";
import LiveBoard from "./ChessBoards/Live";
import Chess from "chess.js";

const DEFAULT_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const DEFAULT_GAME = new Chess(DEFAULT_FEN);

const LiveChess = ({
	pairingParams,
	isPairing,
	setIsPairing,
	setPairingParams,
}) => {
	const [isMobileDrawerVisible, setIsMobileDrawerVisible] = useState(false);
	const [liveGameAttributes, setLiveGameAttributes] = useState(null);
	const [game, setGame] = useState(DEFAULT_GAME);
	const [needNFT, setNeedNFT] = useState(true);

	const { user, isInitialized } = useMoralis();

	const winSize = useWindowSize();
	const boardWidth = useBoardWidth();

	const {
		fetch: joinLiveChess,
		data: challenge,
		// error: challengeError,
		isLoading: joiningLiveChess,
	} = useMoralisCloudFunction(
		"joinLiveChess",
		{
			gamePreferences: pairingParams,
		},
		{
			autoFetch: false,
		}
	);

	const { fetch: doesActiveChallengeExist, data: isLiveChallenge } =
		useMoralisCloudFunction("doesActiveChallengeExist", {});

	const {
		data: [liveChallengeData],
		// error: gameError,
		isLoading: isChallengeLoading,
	} = useMoralisQuery(
		"Challenge",
		(query) => query.equalTo("objectId", challenge?.id),
		[challenge],
		{
			autoFetch: true,
			live: true,
		}
	);

	const {
		data: [liveGameData],
		error: gameError,
		isLoading: isGameLoading,
	} = useMoralisQuery(
		"Game",
		(query) => query.equalTo("challengeId", challenge?.id),
		[challenge],
		{
			autoFetch: true,
			live: true,
		}
	);
	const [gameHistory, setGameHistory] = useState([]);
	useEffect(() => {
		setGameHistory(() => {
			return game.history({ verbose: true });
		});
	}, [game]);

	const gameId = useMemo(() => liveGameData?.id, [liveGameData?.id]);

	const captured = useMemo(
		() =>
			gameHistory.reduce(
				function (acc, move) {
					if ("captured" in move) {
						const piece = move.captured;
						const color = move.color === "w" ? "b" : "w";
						acc[color][piece] += 1;
						return acc;
					} else {
						return acc;
					}
				},
				{
					w: { n: 0, p: 0, b: 0, r: 0, q: 0 },
					b: { n: 0, p: 0, b: 0, r: 0, q: 0 },
				}
			),
		[gameHistory]
	);

	const liveGameObj = useMemo(() => {
		if (liveGameAttributes?.pgn) {
			const _chess = new Chess();
			_chess.load_pgn(liveGameAttributes.pgn);
			return _chess;
		} else {
			return DEFAULT_GAME;
		}
	}, [liveGameAttributes]);

	const isPlayerWhite = useMemo(() => {
		return liveGameData
			? liveGameData.get("sides")?.[user?.get("ethAddress")] === "w"
			: "w";
	}, [liveGameData, user]);

	useEffect(() => {
		doesActiveChallengeExist();
	}, []);

	useEffect(() => {
		if (isPairing || isLiveChallenge) {
			setIsPairing(false);
			joinLiveChess();
		}
	}, [isPairing, isLiveChallenge]);

	useEffect(() => {
		setLiveGameAttributes(liveGameData?.attributes);
	}, [liveGameData]);

	useEffect(() => {
		if (liveGameObj) setGame(liveGameObj);
	}, [liveGameObj]);

	const {
		fetch: claimVictory,
		data: victoryData,
		// error: claimVictoryError,
		isLoading: claimingVictory,
	} = useMoralisCloudFunction(
		"claimVictory",
		{
			needNFT: needNFT,
			gameId: gameId,
		},
		{
			autoFetch: false,
		}
	);

	const {
		fetch: resignGame,
		data: resignData,
		// error: challengeError,
		isLoading: resigningGame,
	} = useMoralisCloudFunction(
		"resign",
		{
			gameId: gameId,
		},
		{
			autoFetch: false,
		}
	);

	const {
		fetch: cancelChallenge,
		data: cancelData,
		// error: challengeError,
		isLoading: cancelingChallenge,
	} = useMoralisCloudFunction(
		"cancelChallenge",
		{},
		{
			autoFetch: false,
		}
	);

	return (
		<>
			<Modals
				isPlayerWhite={isPlayerWhite}
				game={game}
				liveGameAttributes={liveGameAttributes}
				liveChallengeData={liveChallengeData}
				setNeedNFT={setNeedNFT}
				joinLiveChess={joinLiveChess}
				setPairingParams={setPairingParams}
				cancelChallenge={cancelChallenge}
				cancelingChallenge={cancelingChallenge}
			/>
			<ViewWrapper
				opSide={isPlayerWhite ? "b" : "w"}
				isMobileDrawerVisible={isMobileDrawerVisible}
				setIsMobileDrawerVisible={setIsMobileDrawerVisible}
				liveGameAttributes={liveGameAttributes}
				gameHistory={gameHistory}
				isGameLoading={isGameLoading}
				winSize={winSize}
				captured={captured}
				resignGame={resignGame}
				claimVictory={claimVictory}>
				<LiveBoard
					liveGameId={gameId}
					user={user}
					isPlayerWhite={isPlayerWhite}
					playerSide={isPlayerWhite ? "w" : "b"}
					boardWidth={boardWidth}
					gameHistory={gameHistory}
					game={game}
					setGame={setGame}
				/>
			</ViewWrapper>
		</>
	);
};

const ViewWrapper = ({ children, ...rest }) => {
	const winSize = useWindowSize();

	if (winSize.width < 700) return <MobileView {...rest}>{children}</MobileView>;
	else if (winSize.width >= 700 && winSize.width < 1200)
		return <TabView {...rest}>{children}</TabView>;
	else return <DesktopView {...rest}>{children}</DesktopView>;
};

const Modals = ({
	game,
	liveGameAttributes,
	isPlayerWhite,
	liveChallengeData,
	setNeedNFT,
	joinLiveChess,
	setPairingParams,
	cancelChallenge,
	cancelingChallenge,
}) => {
	const handleClaimPool = () => {
		setNeedNFT(false);
	};
	const handleClaimPoolAndNFT = () => {
		setNeedNFT(true);
	};
	const handleQuickMatch = () => {
		setPairingParams({
			lowerElo: 100,
			upperElo: 100,
			preferedSide: "w",
		});
		joinLiveChess();
	};

	return (
		<>
			<Modal
				title="Loading"
				visible={liveChallengeData?.get("challengeStatus") === 0}
				footer={
					<Button key="only Stake" onClick={cancelChallenge}>
						Cancel Challenge
					</Button>
				}
				closable={false}>
				<h2>🔍 Finding you a match...</h2>
			</Modal>
			<Modal
				title="Loading"
				visible={liveChallengeData?.get("challengeStatus") === 1}
				footer={null}
				closable={false}>
				<h2>Match Found. Waiting for Opponent 🎠 ...</h2>
			</Modal>
			<Modal
				title="Canceling"
				visible={cancelingChallenge}
				footer={null}
				closable={false}>
				<h2>Canceling this Challenge :x: ...</h2>
			</Modal>
			<Modal
				title="Loading"
				visible={liveChallengeData?.get("challengeStatus") === 3}
				footer={null}>
				<h2>🤖 Inactivity from the Opponent...</h2>
			</Modal>
			<Modal
				title="Victory"
				visible={
					game.game_over() &&
					((liveGameAttributes?.outcome === 3 && isPlayerWhite) ||
						(liveGameAttributes?.outcome === 4 && !isPlayerWhite))
				}
				footer={[
					<Button key="only Stake" onClick={handleClaimPool}>
						Claim Pool
					</Button>,
					<Button key="with NFT" type="primary" onClick={handleClaimPoolAndNFT}>
						Claim Pool + Mint NFT
					</Button>,
				]}
				width={window.getComputedStyle(document.body).fontSize * 25}>
				<h1>🎊 You Won the Game 🎊</h1>
				<h3>{liveGameAttributes?.outcome === 3 ? "1 - 0" : "0 - 1"}</h3>
			</Modal>
			<Modal
				title="Defeat"
				visible={
					(game.game_over() &&
						!(
							(liveGameAttributes?.outcome === 3 && isPlayerWhite) ||
							(liveGameAttributes?.outcome === 4 && !isPlayerWhite)
						)) ||
					liveChallengeData?.get("challengeStatus") === 3
				}
				footer={[
					<Button key="quickMatch" type="primary" onClick={handleQuickMatch}>
						Quick Match
					</Button>,
				]}
				width={window.getComputedStyle(document.body).fontSize * 25}>
				<h1>🫂 You Lost the Game 🫂</h1>
				<h3>{liveGameAttributes?.outcome === 3 ? "1 - 0" : "0 - 1"}</h3>
			</Modal>
			<Modal
				title="Loading"
				visible={game.game_over() && !liveGameAttributes?.outcome === 2}
				footer={[
					<Button key="quickMatch" type="primary" onClick={handleQuickMatch}>
						Quick Match
					</Button>,
				]}
				width={window.getComputedStyle(document.body).fontSize * 25}>
				<h1>Game Drawn 😅</h1>
				<h3>1/2 - 1/2</h3>
			</Modal>
		</>
	);
};

export default LiveChess;

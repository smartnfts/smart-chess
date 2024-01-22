export const gameAbi = [
	{
		type: "constructor",
		stateMutability: "nonpayable",
		inputs: [
			{ type: "address", name: "_chessToken", internalType: "address" },
			{ type: "address", name: "_chessNFT", internalType: "address" },
			{ type: "address", name: "_elo", internalType: "address" },
			{ type: "address", name: "serverAddress", internalType: "address" },
		],
	},
	{
		type: "event",
		name: "Approval",
		inputs: [
			{
				type: "address",
				name: "owner",
				internalType: "address",
				indexed: true,
			},
			{
				type: "address",
				name: "spender",
				internalType: "address",
				indexed: true,
			},
			{
				type: "uint256",
				name: "value",
				internalType: "uint256",
				indexed: false,
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "GameEnded",
		inputs: [
			{
				type: "string",
				name: "gameId",
				internalType: "string",
				indexed: false,
			},
			{
				type: "address",
				name: "white",
				internalType: "address",
				indexed: true,
			},
			{
				type: "address",
				name: "black",
				internalType: "address",
				indexed: true,
			},
			{ type: "uint8", name: "outcome", internalType: "uint8", indexed: false },
			{
				type: "uint256",
				name: "eloW",
				internalType: "uint256",
				indexed: false,
			},
			{
				type: "uint256",
				name: "eloB",
				internalType: "uint256",
				indexed: false,
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "GameStarted",
		inputs: [
			{
				type: "string",
				name: "gameId",
				internalType: "string",
				indexed: false,
			},
			{
				type: "address",
				name: "white",
				internalType: "address",
				indexed: true,
			},
			{
				type: "address",
				name: "black",
				internalType: "address",
				indexed: true,
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "OwnershipTransferred",
		inputs: [
			{
				type: "address",
				name: "previousOwner",
				internalType: "address",
				indexed: true,
			},
			{
				type: "address",
				name: "newOwner",
				internalType: "address",
				indexed: true,
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "StakedBalance",
		inputs: [
			{
				type: "address",
				name: "player",
				internalType: "address",
				indexed: true,
			},
			{
				type: "uint256",
				name: "amount",
				internalType: "uint256",
				indexed: false,
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "Transfer",
		inputs: [
			{ type: "address", name: "from", internalType: "address", indexed: true },
			{ type: "address", name: "to", internalType: "address", indexed: true },
			{
				type: "uint256",
				name: "value",
				internalType: "uint256",
				indexed: false,
			},
		],
		anonymous: false,
	},
	{
		type: "function",
		stateMutability: "view",
		outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
		name: "allowance",
		inputs: [
			{ type: "address", name: "owner", internalType: "address" },
			{ type: "address", name: "spender", internalType: "address" },
		],
	},
	{
		type: "function",
		stateMutability: "nonpayable",
		outputs: [{ type: "bool", name: "", internalType: "bool" }],
		name: "approve",
		inputs: [
			{ type: "address", name: "spender", internalType: "address" },
			{ type: "uint256", name: "amount", internalType: "uint256" },
		],
	},
	{
		type: "function",
		stateMutability: "view",
		outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
		name: "balanceOf",
		inputs: [{ type: "address", name: "account", internalType: "address" }],
	},
	{
		type: "function",
		stateMutability: "nonpayable",
		outputs: [],
		name: "changeBet",
		inputs: [{ type: "uint256", name: "_bet", internalType: "uint256" }],
	},
	{
		type: "function",
		stateMutability: "nonpayable",
		outputs: [],
		name: "changeFee",
		inputs: [{ type: "uint256", name: "_fee", internalType: "uint256" }],
	},
	{
		type: "function",
		stateMutability: "nonpayable",
		outputs: [],
		name: "changeNFTFee",
		inputs: [{ type: "uint256", name: "_fee", internalType: "uint256" }],
	},
	{
		type: "function",
		stateMutability: "nonpayable",
		outputs: [],
		name: "changeServer",
		inputs: [{ type: "address", name: "newMaster", internalType: "address" }],
	},
	{
		type: "function",
		stateMutability: "view",
		outputs: [
			{ type: "address", name: "", internalType: "contract IChessNFT" },
		],
		name: "chessNFT",
		inputs: [],
	},
	{
		type: "function",
		stateMutability: "view",
		outputs: [{ type: "address", name: "", internalType: "contract IERC20" }],
		name: "chessToken",
		inputs: [],
	},
	{
		type: "function",
		stateMutability: "nonpayable",
		outputs: [],
		name: "collectFee",
		inputs: [],
	},
	{
		type: "function",
		stateMutability: "view",
		outputs: [{ type: "uint8", name: "", internalType: "uint8" }],
		name: "decimals",
		inputs: [],
	},
	{
		type: "function",
		stateMutability: "nonpayable",
		outputs: [{ type: "bool", name: "", internalType: "bool" }],
		name: "decreaseAllowance",
		inputs: [
			{ type: "address", name: "spender", internalType: "address" },
			{ type: "uint256", name: "subtractedValue", internalType: "uint256" },
		],
	},
	{
		type: "function",
		stateMutability: "view",
		outputs: [{ type: "address", name: "", internalType: "contract IElo" }],
		name: "elo",
		inputs: [],
	},
	{
		type: "function",
		stateMutability: "nonpayable",
		outputs: [{ type: "uint256", name: "nftId", internalType: "uint256" }],
		name: "endGame",
		inputs: [
			{ type: "string", name: "_gameId", internalType: "string" },
			{ type: "uint8", name: "_outcome", internalType: "uint8" },
			{ type: "string", name: "_ipfsHash", internalType: "string" },
		],
	},
	{
		type: "function",
		stateMutability: "view",
		outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
		name: "getBetAmount",
		inputs: [],
	},
	{
		type: "function",
		stateMutability: "view",
		outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
		name: "getCollectedFees",
		inputs: [],
	},
	{
		type: "function",
		stateMutability: "view",
		outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
		name: "getFeeAmount",
		inputs: [],
	},
	{
		type: "function",
		stateMutability: "view",
		outputs: [
			{
				type: "tuple",
				name: "game",
				internalType: "struct ChessGame.Game",
				components: [
					{ type: "address", name: "white", internalType: "address" },
					{ type: "address", name: "black", internalType: "address" },
					{ type: "uint8", name: "outcome", internalType: "uint8" },
					{ type: "uint256", name: "nft", internalType: "uint256" },
				],
			},
		],
		name: "getGame",
		inputs: [{ type: "string", name: "_gameId", internalType: "string" }],
	},
	{
		type: "function",
		stateMutability: "view",
		outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
		name: "getNFTfeeAmount",
		inputs: [],
	},
	{
		type: "function",
		stateMutability: "nonpayable",
		outputs: [{ type: "bool", name: "", internalType: "bool" }],
		name: "increaseAllowance",
		inputs: [
			{ type: "address", name: "spender", internalType: "address" },
			{ type: "uint256", name: "addedValue", internalType: "uint256" },
		],
	},
	{
		type: "function",
		stateMutability: "view",
		outputs: [{ type: "string", name: "", internalType: "string" }],
		name: "name",
		inputs: [],
	},
	{
		type: "function",
		stateMutability: "view",
		outputs: [{ type: "address", name: "", internalType: "address" }],
		name: "owner",
		inputs: [],
	},
	{
		type: "function",
		stateMutability: "nonpayable",
		outputs: [],
		name: "renounceOwnership",
		inputs: [],
	},
	{
		type: "function",
		stateMutability: "nonpayable",
		outputs: [],
		name: "stake",
		inputs: [{ type: "uint256", name: "_amount", internalType: "uint256" }],
	},
	{
		type: "function",
		stateMutability: "nonpayable",
		outputs: [],
		name: "startGame",
		inputs: [
			{ type: "string", name: "_gameId", internalType: "string" },
			{ type: "address", name: "_white", internalType: "address" },
			{ type: "address", name: "_black", internalType: "address" },
		],
	},
	{
		type: "function",
		stateMutability: "view",
		outputs: [{ type: "string", name: "", internalType: "string" }],
		name: "symbol",
		inputs: [],
	},
	{
		type: "function",
		stateMutability: "view",
		outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
		name: "totalSupply",
		inputs: [],
	},
	{
		type: "function",
		stateMutability: "nonpayable",
		outputs: [{ type: "bool", name: "", internalType: "bool" }],
		name: "transfer",
		inputs: [
			{ type: "address", name: "to", internalType: "address" },
			{ type: "uint256", name: "amount", internalType: "uint256" },
		],
	},
	{
		type: "function",
		stateMutability: "nonpayable",
		outputs: [{ type: "bool", name: "", internalType: "bool" }],
		name: "transferFrom",
		inputs: [
			{ type: "address", name: "from", internalType: "address" },
			{ type: "address", name: "to", internalType: "address" },
			{ type: "uint256", name: "amount", internalType: "uint256" },
		],
	},
	{
		type: "function",
		stateMutability: "nonpayable",
		outputs: [],
		name: "transferOwnership",
		inputs: [{ type: "address", name: "newOwner", internalType: "address" }],
	},
	{
		type: "function",
		stateMutability: "nonpayable",
		outputs: [],
		name: "unstake",
		inputs: [{ type: "uint256", name: "_amount", internalType: "uint256" }],
	},
];

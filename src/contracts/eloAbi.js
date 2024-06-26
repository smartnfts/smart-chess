export const eloAbi = [
	{
		type: "event",
		name: "EloChanged",
		inputs: [
			{
				type: "address",
				name: "player",
				internalType: "address",
				indexed: true,
			},
			{
				type: "uint256",
				name: "newElo",
				internalType: "uint256",
				indexed: false,
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
		type: "function",
		stateMutability: "pure",
		outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
		name: "abs",
		inputs: [{ type: "int256", name: "value", internalType: "int256" }],
	},
	{
		type: "function",
		stateMutability: "nonpayable",
		outputs: [],
		name: "changeMaster",
		inputs: [{ type: "address", name: "_newMaster", internalType: "address" }],
	},
	{
		type: "function",
		stateMutability: "view",
		outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
		name: "getElo",
		inputs: [{ type: "address", name: "_player", internalType: "address" }],
	},
	{
		type: "function",
		stateMutability: "pure",
		outputs: [{ type: "int256", name: "", internalType: "int256" }],
		name: "getScoreChange",
		inputs: [
			{ type: "int256", name: "difference", internalType: "int256" },
			{ type: "uint256", name: "outcome", internalType: "uint256" },
		],
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
		outputs: [
			{ type: "uint256", name: "", internalType: "uint256" },
			{ type: "uint256", name: "", internalType: "uint256" },
		],
		name: "recordResult",
		inputs: [
			{ type: "address", name: "player1", internalType: "address" },
			{ type: "address", name: "player2", internalType: "address" },
			{ type: "uint8", name: "outcome", internalType: "uint8" },
		],
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
		name: "setElo",
		inputs: [
			{ type: "address", name: "_player", internalType: "address" },
			{ type: "uint256", name: "_elo", internalType: "uint256" },
		],
	},
	{
		type: "function",
		stateMutability: "nonpayable",
		outputs: [],
		name: "transferOwnership",
		inputs: [{ type: "address", name: "newOwner", internalType: "address" }],
	},
];

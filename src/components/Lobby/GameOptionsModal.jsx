import { useState } from "react";
import { Modal, Radio, InputNumber } from "antd";
import { ReactComponent as WKing } from "../../assets/chess_svgs/k_w.svg";
import { ReactComponent as BKing } from "../../assets/chess_svgs/k_b.svg";
import { useWindowSize } from "../../hooks/useWindowSize";
import { useMoralis, useMoralisCloudFunction } from "react-moralis";
import { CheckCircleOutlined } from "@ant-design/icons";

const GameOptionsModal = ({
	isModalVisible,
	setIsModalVisible,
	pairingParams,
	setPairingParams,
	setIsPairing,
	joinLiveChess,
	elo,
}) => {
	const { user } = useMoralis();

	const [gameOptions, setGameOptions] = useState({
		color: "w",
		rangeUpper: 100,
		rangeLower: 100,
	});

	const { confirm } = Modal;

	function showGameConfirm() {
		confirm({
			title: "Are you sure you want to start a game?",
			icon: <CheckCircleOutlined />,
			content: "By starting the game you bet 10 GHODA in the pool.",
			okText: "Start Game",
			okType: "primary",
			cancelText: "Close",
			onOk() {
				joinLiveChess({ pairingParams });
				setIsPairing(true);
			},
			onCancel() {
				console.log("Cancel");
			},
		});
	}

	const handleOk = () => {
		setPairingParams(gameOptions);
		setIsModalVisible(false);
		showGameConfirm();
	};

	const winSize = useWindowSize();

	const handleCancel = () => {
		setIsModalVisible(false);
	};
	window.user = user;

	return (
		<Modal
			title="Game Options"
			className="options-modal"
			okText="Create Game"
			width={"50ch"}
			height={winSize.height > 300 ? "50%" : "100%"}
			bodyStyle={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-around",
				alignItems: "center",
				padding: "2rem",
				userSelect: "none",
			}}
			visible={isModalVisible}
			onOk={handleOk}
			onCancel={handleCancel}
		>
			<Radio.Group
				value={gameOptions.color}
				style={{
					width: "35%",
					display: "flex",
					justifyContent: "space-around",
					alignItems: "center",
				}}
				onChange={(e) => {
					// console.log(e);
					setGameOptions({ ...gameOptions, color: e.target.value });
				}}
				className="wb-group"
				defaultValue="w"
				size="large"
				buttonStyle="solid"
			>
				<Radio.Button
					label="Choose Sides"
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						borderRadius: "0.5rem",
						width: "4rem",
						height: "4rem",
						marginRight: "1rem",
					}}
					className="wb"
					value="w"
				>
					<WKing style={{ marginTop: "0.5rem", width: 30, height: 30 }} />
				</Radio.Button>
				<Radio.Button
					label="Choose Sides"
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						borderRadius: "0.5rem",
						width: "4rem",
						height: "4rem",
					}}
					className="wb"
					value="b"
				>
					<BKing style={{ marginTop: "0.5rem", width: 30, height: 30 }} />
				</Radio.Button>
			</Radio.Group>
			<div
				className="rating"
				style={{
					marginTop: "2rem",
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-around",
					alignItems: "center",
					width: "80%",
					height: "40%",
				}}
			>
				<span
					className="title"
					style={{
						width: "100%",
						fontSize: "1.2rem",
						fontWeight: "600",
						textAlign: "center",
						marginBottom: "1rem",
					}}
				>
					ELO Rating Range
				</span>
				<div
					className="rating-input"
					style={{
						fontSize: "1.5rem",
						fontWeight: 600,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<InputNumber
						size="large"
						min={1}
						max={10000}
						value={gameOptions.rangeUpper}
						onChange={(val) => {
							setGameOptions({ ...gameOptions, rangeUpper: val });
						}}
					/>
					<span
						className="label inc"
						style={{
							fontSize: "1.5rem",
							fontWeight: 600,
							marginLeft: "0.25rem",
							marginRight: "1rem",
						}}
					>
						+
					</span>
					<span
						style={{
							fontSize: "1.5rem",
							fontWeight: 800,
							padding: "0 0.5rem",
							color: "white",
							backgroundColor: "rgba(0,0,0,0.85)",
							borderRadius: "0.5rem",
						}}
					>
						{elo}
					</span>
					<span
						className="label dec"
						style={{
							fontSize: "1.5rem",
							fontWeight: 600,
							marginRight: "0.25rem",
							marginLeft: "1rem",
						}}
					>
						-
					</span>
					<InputNumber
						size="large"
						min={1}
						max={10000}
						value={gameOptions.rangeLower}
						onChange={(val) => {
							// console.log(e);
							setGameOptions({ ...gameOptions, rangeLower: val });
						}}
					/>
				</div>
			</div>
		</Modal>
	);
};

export default GameOptionsModal;

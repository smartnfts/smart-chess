import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { MoralisProvider } from "react-moralis";

import "./styles/index.scss";

const APP_ID = process.env.REACT_APP_MORALIS_APPLICATION_ID;
const SERVER_URL = process.env.REACT_APP_MORALIS_SERVER_URL;

const Application = () => {
	const isServerInfo = APP_ID && SERVER_URL ? true : false;
	if (isServerInfo)
		return (
			<MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
				<App isServerInfo />
			</MoralisProvider>
		);
};

ReactDOM.render(
	// <React.StrictMode>
	<Application />,
	// </React.StrictMode>,
	document.getElementById("root"),
);

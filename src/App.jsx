// src/App.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Layout, Button, notification } from "antd";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation,
} from "react-router-dom";
import { useWindowSize } from "./hooks/useWindowSize";
import { ReactComponent as LogoImg } from "./assets/logoSvg.svg";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";

import { ELO_TOKEN_ADDRESS } from "./contracts/address";
import { eloAbi } from "./contracts/eloAbi";

import Account from "./components/Account";
import Chains from "./components/Chains";
import Stakes from "./components/Stakes";
import NFTBalance from "./components/NFTBalance";
import MenuItems from "./components/MenuItems";
import Lobby from "./components/Lobby";
import LiveChess from "./components/LiveChess/";

import "./styles/main.scss";
import "./style.css";
import "antd/dist/antd.css";

const { Header, Footer } = Layout;

const App = () => {
  const { width } = useWindowSize();
  const [isPairing, setIsPairing] = useState(false);
  const [pairingParams, setPairingParams] = useState({});
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [elo, setElo] = useState(null);

  const fetchElo = useCallback(async () => {
    if (web3 && account) {
      const contract = new web3.eth.Contract(eloAbi, ELO_TOKEN_ADDRESS);
      const elo = await contract.methods.getElo(account).call();
      setElo(elo);
    }
  }, [web3, account]);

  useEffect(() => {
    const init = async () => {
      const provider = await detectEthereumProvider();

      if (provider) {
        const web3Instance = new Web3(provider);
        setWeb3(web3Instance);
        try {
          // Request account access if needed
          const accounts = await provider.request({ method: "eth_requestAccounts" });
          setAccount(accounts[0]);

          // Set up the chain ID check and handling
          const chainId = await web3Instance.eth.getChainId();
          const EXPECTED_CHAIN_ID = 49740; // Replace with Energi chain ID

          if (chainId !== EXPECTED_CHAIN_ID) {
            console.error(`Please connect to the Energi network`);
            await switchToEnergiNetwork();
          }
        } catch (error) {
          console.error("User denied account access or there was an error", error);
        }
      } else {
        console.error("Please install MetaMask!");
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (account) fetchElo();
  }, [account, web3, fetchElo]);

  const switchToEnergiNetwork = async () => {
    const energiNetwork = {
      chainId: "0xc204", // Energi chain ID in hexadecimal (49740 in decimal)
      chainName: "Energi Mainnet",
      nativeCurrency: {
        name: "Energi",
        symbol: "NRG",
        decimals: 18,
      },
      rpcUrls: ["https://nodeapi.energi.network"],
      blockExplorerUrls: ["https://explorer.energi.network"],
    };

    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [energiNetwork],
      });
    } catch (switchError) {
      console.error("Failed to switch to the Energi network", switchError);
    }
  };

  return (
    <Layout style={{ height: "100vh", overflow: "auto" }}>
      <Router>
        {isPairing && <Redirect to="/live-chess" />}
        {/* Antd Notification wrapped inside Route*/}
        <ActiveChallengeNotification setIsPairing={setIsPairing} />
        {width > 860 ? (
          <Nav elo={elo} />
        ) : (
          <>
            <NavSmTop elo={elo} />
            <NavSmBtm />
          </>
        )}
        <div style={styles.content}>
          <Switch>
            <Route exact path="/lobby">
              <Lobby
                setIsPairing={setIsPairing}
                setPairingParams={setPairingParams}
                pairingParams={pairingParams}
                elo={elo}
              />
            </Route>
            <Route path="/stakes">
              <Stakes />
            </Route>
            <Route path="/nftBalance">
              <NFTBalance />
            </Route>
            <Route user={account} path="/live-chess">
              <LiveChess
                user={account}
                isPairing={isPairing}
                setIsPairing={setIsPairing}
                pairingParams={pairingParams}
                setPairingParams={setPairingParams}
              />
            </Route>
            <Route path="/">
              <Redirect to="/lobby" />
            </Route>
          </Switch>
        </div>
      </Router>
    </Layout>
  );
};

const ActiveChallengeNotification = ({ setIsPairing }) => {
  const location = useLocation();
  const openNotification = useCallback(() => {
    const key = `live-chess-notification`;
    const btn = (
      <Button
        type="primary"
        size="small"
        onClick={() => {
          setIsPairing(true);
        }}
      >
        Live Chess
      </Button>
    );
    notification.warn({
      message: "Active Challenge Abandoned",
      description:
        "You have a live game or pairing process in progress. Please return to live chess to continue.",
      btn,
      key,
      duration: 0,
      onClose: () => fetch(),
      placement: "bottomRight",
    });
  }, [setIsPairing]);

  useEffect(() => {
    // Implement the logic to check for active challenges and call openNotification if necessary
    // fetchActiveChallenges().then(challenge => {
    //   if (challenge && !location.pathname.includes("live-chess")) {
    //     openNotification();
    //   }
    //   if (location.pathname.includes("live-chess") || !challenge) {
    //     notification.close(`live-chess-notification`);
    //   }
    // });

    // Dummy implementation for illustration purposes
    const challenge = false; // Replace with actual check for active challenges
    if (challenge && !location.pathname.includes("live-chess")) {
      openNotification();
    }
    if (location.pathname.includes("live-chess") || !challenge) {
      notification.close(`live-chess-notification`);
    }
  }, [location, openNotification]);

  return <></>;
};

const Nav = ({ elo }) => (
  <Header style={styles.header}>
    <Logo />
    <MenuItems />
    <div style={styles.headerRight}>
      <Chains />
      <Account elo={elo} />
    </div>
  </Header>
);

const NavSmTop = ({ elo }) => (
  <Header style={styles.header}>
    <Logo />
    <div style={styles.headerRight}>
      <Chains />
      <Account elo={elo} />
    </div>
  </Header>
);

const NavSmBtm = () => (
  <Footer style={styles.footer}>
    <MenuItems />
  </Footer>
);

const styles = {
  content: {
    display: "flex",
    justifyContent: "center",
    fontFamily: "Roboto, sans-serif",
    color: "#041836",
    marginTop: "60px",
  },
  header: {
    position: "fixed",
    zIndex: 9999,
    width: "100%",
    background: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Poppins, sans-serif",
    borderBottom: "2px solid rgba(0, 0, 0, 0.06)",
    padding: "0 10px",
    boxShadow: "0 1px 10px rgb(151 164 175 / 10%)",
    userSelect: "none",
  },
  headerRight: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    fontSize: "15px",
    fontWeight: "600",
  },
  footer: {
    position: "fixed",
    zIndex: 9999,
    width: "100%",
    background: "#fff",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    fontFamily: "Poppins, sans-serif",
    borderTop: "2px solid rgba(0, 0, 0, 0.06)",
    padding: "0 10px",
    boxShadow: "0 1px 10px rgb(151 164 175 / 10%)",
    userSelect: "none",
    bottom: 0,
    height: "5rem",
  },
};

export const Logo = () => (
  <a
    href="https://chess.smartnfts.art/"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
    }}
  >
    <LogoImg height={40} width={150} style={{ margin: "auto 0" }} />
  </a>
);

export default App;

// src/components/Account.jsx
import Web3 from "web3";
import { getEllipsisTxt } from "../helpers/formatters";
import Blockie from "./Blockie";
import { Button, Card, Modal } from "antd";
import { useState, useEffect } from "react";
import Address from "./Address/Address";
import { SelectOutlined } from "@ant-design/icons";
import { getExplorer } from "../helpers/networks";

const styles = {
  account: {
    height: "42px",
    padding: "0 15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "fit-content",
    borderRadius: "12px",
    backgroundColor: "rgb(244, 244, 244)",
    cursor: "pointer",
  },
  text: {
    color: "#21BF96",
  },
};

function Account({ elo }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

  const connectWallet = async () => {
    try {
      const accounts = await web3.eth.requestAccounts();
      setAccount(accounts[0]);
      const chainId = await web3.eth.getChainId();
      setChainId(chainId);
    } catch (error) {
      console.error("Failed to connect wallet", error);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setChainId(null);
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (web3.givenProvider && web3.givenProvider.on) {
      web3.givenProvider.on("accountsChanged", (accounts) => {
        setAccount(accounts[0] || null);
      });
      web3.givenProvider.on("chainChanged", (chainId) => {
        setChainId(chainId);
      });
    }
    return () => {
      if (web3.givenProvider && web3.givenProvider.removeListener) {
        web3.givenProvider.removeListener("accountsChanged");
        web3.givenProvider.removeListener("chainChanged");
      }
    };
  }, [web3.givenProvider]);

  if (!account) {
    return (
      <div style={styles.account} onClick={connectWallet}>
        <p style={styles.text}>Connect Wallet</p>
      </div>
    );
  }

  return (
    <>
      <div style={styles.account} onClick={() => setIsModalVisible(true)}>
        <p style={{ marginRight: "5px", ...styles.text }}>
          {getEllipsisTxt(account, 6)}
        </p>
        <Blockie address={account.toLowerCase()} scale={3} />
      </div>
      <Modal
        visible={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
        bodyStyle={{
          padding: "15px",
          fontSize: "17px",
          fontWeight: "500",
        }}
        style={{ fontSize: "16px", fontWeight: "500" }}
        width="400px"
      >
        Account
        <Card
          style={{
            marginTop: "10px",
            borderRadius: "1rem",
          }}
          bodyStyle={{ padding: "15px" }}
        >
          <Address
            address={account}
            avatar="left"
            size={6}
            copyable
            style={{ fontSize: "20px" }}
          />
          <div className="elo">ELO Rating: {elo}</div>
          <div style={{ marginTop: "10px", padding: "0 10px" }}>
            <a
              href={`${getExplorer(chainId)}/address/${account}`}
              target="_blank"
              rel="noreferrer"
            >
              <SelectOutlined style={{ marginRight: "5px" }} />
              View on Explorer
            </a>
          </div>
        </Card>
        <Button
          size="large"
          type="primary"
          style={{
            width: "100%",
            marginTop: "10px",
            borderRadius: "0.5rem",
            fontSize: "16px",
            fontWeight: "500",
          }}
          onClick={disconnectWallet}
        >
          Disconnect Wallet
        </Button>
      </Modal>
    </>
  );
}

export default Account;

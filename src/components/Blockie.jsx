// src/components/Blockie.jsx
import { Skeleton } from "antd";
import Blockies from "react-blockies";
import { useEffect, useState } from "react";
import Web3 from "web3";

/**
 * Shows a blockie image for the provided wallet address
 * @param {*} props
 * @returns <Blockies> JSX Element
 */

function Blockie(props) {
  const [currentAddress, setCurrentAddress] = useState(null);
  const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

  useEffect(() => {
    const getCurrentAddress = async () => {
      try {
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
          setCurrentAddress(accounts[0]);
        }
      } catch (error) {
        console.error("Failed to get current address", error);
      }
    };

    if (props.currentWallet) {
      getCurrentAddress();
    }
  }, [props.currentWallet, web3]);

  const addressToSeed = props.currentWallet ? currentAddress : props.address;

  if (!addressToSeed) {
    return <Skeleton.Avatar active size={40} />;
  }

  return (
    <Blockies
      seed={addressToSeed.toLowerCase()}
      className="identicon"
      {...props}
    />
  );
}

export default Blockie;

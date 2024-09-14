// src/components/AddressInput.jsx
import { useCallback, useEffect, useRef, useState } from "react";
import Web3 from "web3";
import { getEllipsisTxt } from "../helpers/formatters";
import Blockie from "./Blockie";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

function AddressInput(props) {
  const input = useRef(null);
  const [address, setAddress] = useState("");
  const [validatedAddress, setValidatedAddress] = useState("");
  const [isDomain, setIsDomain] = useState(false);
  const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (validatedAddress) props.onChange(isDomain ? validatedAddress : address);
  }, [props, validatedAddress, isDomain, address]);

  const updateAddress = useCallback(
    async (value) => {
      setAddress(value);
      if (isSupportedDomain(value)) {
        const processPromise = function (promise) {
          promise
            .then((addr) => {
              setValidatedAddress(addr);
              setIsDomain(true);
            })
            .catch(() => {
              setValidatedAddress("");
            });
        };
        if (value.endsWith(".eth")) {
          processPromise(web3.eth.ens.getAddress(value));
        } else {
          // Implement other domain resolution if necessary
          // For now, just set as not resolved
          setValidatedAddress("");
        }
      } else if (value.length === 42) {
        setValidatedAddress(getEllipsisTxt(value, 10));
        setIsDomain(false);
      } else {
        setValidatedAddress("");
        setIsDomain(false);
      }
    },
    [web3.eth.ens],
  );

  const Cross = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="#E33132"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      onClick={() => {
        setValidatedAddress("");
        setIsDomain(false);
        setTimeout(function () {
          input.current.focus();
        });
      }}
      style={{ cursor: "pointer" }}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );

  return (
    <Input
      ref={input}
      size="large"
      placeholder={props.placeholder ? props.placeholder : "Public address"}
      prefix={
        isDomain || address.length === 42 ? (
          <Blockie
            address={(isDomain ? validatedAddress : address).toLowerCase()}
            size={8}
            scale={3}
          />
        ) : (
          <SearchOutlined />
        )
      }
      suffix={validatedAddress && <Cross />}
      autoFocus={props.autoFocus}
      value={
        isDomain
          ? `${address} (${getEllipsisTxt(validatedAddress)})`
          : validatedAddress || address
      }
      onChange={(e) => {
        updateAddress(e.target.value);
      }}
      disabled={validatedAddress}
      style={
        validatedAddress
          ? { ...props?.style, border: "1px solid rgb(33, 191, 150)" }
          : { ...props?.style }
      }
    />
  );
}

function isSupportedDomain(domain) {
  return [
    ".eth",
    ".crypto",
    ".coin",
    ".wallet",
    ".bitcoin",
    ".x",
    ".888",
    ".nft",
    ".dao",
    ".blockchain",
  ].some((tld) => domain.endsWith(tld));
}

export default AddressInput;

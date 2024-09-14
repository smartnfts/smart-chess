import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useSound from "use-sound";
import Confirmation from "../assets/chess_audio/Confirmation.mp3";
import SocialNotify from "../assets/chess_audio/SocialNotify.mp3";
import { ReactComponent as Knight } from "../assets/knight.svg";
import { Card, Image, Tooltip, Modal, Tabs, Skeleton } from "antd";
import {
  FileSearchOutlined,
  SendOutlined,
  GiftOutlined,
  SkinOutlined,
  CheckCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { getExplorer } from "../helpers/networks";
import AddressInput from "./AddressInput";
import { NFT_TOKEN_ADDRESS } from "../contracts/address";
import { ethers } from "ethers";

const { Meta } = Card;
const { TabPane } = Tabs;

const styles = {
  NFTs: {
    display: "flex",
    flexWrap: "wrap",
    WebkitBoxPack: "start",
    justifyContent: "flex-start",
    margin: "2rem auto 0",
    maxWidth: "1000px",
    width: "100%",
    gap: "10px",
  },
};

const provider = new ethers.JsonRpcProvider("https://rpc.energi.network/");

async function fetchNFTs(ownerAddress) {
  const nftContract = new ethers.Contract(
    NFT_TOKEN_ADDRESS,
    ["function balanceOf(address owner) view returns (uint256)"],
    provider
  );

  const balance = await nftContract.balanceOf(ownerAddress);
  // Fetch more details about NFTs if necessary
  // Return mock data for now
  return [{ token_id: "1", token_uri: "https://example.com/nft/1" }];
}

async function transferNFT(nft, receiver) {
  const nftContract = new ethers.Contract(
    NFT_TOKEN_ADDRESS,
    [
      "function transferFrom(address from, address to, uint256 tokenId) public",
    ],
    provider.getSigner()
  );

  try {
    const tx = await nftContract.transferFrom(
      await provider.getSigner().getAddress(),
      receiver,
      nft.token_id
    );
    await tx.wait();
    return tx;
  } catch (error) {
    throw new Error(error.message);
  }
}

function NFTBalance() {
  const [visible, setVisibility] = useState(false);
  const [receiverToSend, setReceiver] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [nftToSend, setNftToSend] = useState(null);
  const [userNFTs, setUserNFTs] = useState([]);
  const [isLoadingUserNFTs, setIsLoadingUserNFTs] = useState(true);
  const [skinData, setSkinData] = useState(null);

  useEffect(() => {
    async function loadNFTs() {
      const userAddress = "user_address_here"; // Replace with the actual user address
      try {
        const nfts = await fetchNFTs(userAddress);
        setUserNFTs(nfts);
      } catch (error) {
        console.error("Failed to fetch NFTs:", error);
      } finally {
        setIsLoadingUserNFTs(false);
      }
    }

    loadNFTs();
  }, []);

  async function handleTransfer() {
    setIsPending(true);
    try {
      await transferNFT(nftToSend, receiverToSend);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsPending(false);
      setVisibility(false);
    }
  }

  return (
    <>
      <Tabs
        defaultActiveKey="1"
        type="card"
        style={{ marginTop: 40, width: "100%", maxWidth: 1000 }}
      >
        <TabPane key="1" tab="Your NFTs">
          <div style={styles.NFTs}>
            <Skeleton loading={isLoadingUserNFTs}>
              {userNFTs.length > 0 ? (
                userNFTs.map(({ token_id, token_uri }, index) => (
                  <NFTCard
                    token_id={token_id}
                    token_uri={token_uri}
                    setNftToSend={setNftToSend}
                    key={index}
                    skinData={skinData}
                    setVisibility={setVisibility}
                  />
                ))
              ) : (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Knight style={{ width: 100, height: 100, opacity: 0.5 }} />
                  <h1 style={{ fontSize: "2rem", marginTop: "-17.5rem" }}>
                    No NFTs found
                  </h1>
                  <Link
                    to="/lobby"
                    style={{
                      color: "#58c563",
                      textDecoration: "none",
                      fontSize: "1.2rem",
                      cursor: "pointer",
                      zIndex: 100,
                    }}
                  >
                    Earn one here
                  </Link>
                </div>
              )}
            </Skeleton>
          </div>
        </TabPane>
        <TabPane key="2" tab="Active Skins">
          {!skinData ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Knight style={{ width: 100, opacity: 0.5 }} />
              <h1 style={{ fontSize: "2rem", marginTop: "-17.5rem" }}>
                No Skins in use
              </h1>
            </div>
          ) : (
            <div style={styles.NFTs}>
              {Object.keys(skinData)
                .filter((key) => key.length === 2)
                .map((pieceKey, index) => (
                  <Card
                    hoverable
                    actions={[
                      <Tooltip title="View On OpenSea">
                        <GiftOutlined
                          onClick={() => {
                            window.open(skinData[pieceKey], "_blank").focus();
                          }}
                        />
                      </Tooltip>,
                    ]}
                    style={{
                      width: 300,
                      border: "2px solid #e7eaf3",
                    }}
                    cover={
                      <Image
                        preview={false}
                        src={skinData[pieceKey] || "error"}
                        fallback="data:image/png;base64,..."
                        alt=""
                        style={{ height: "300px" }}
                      />
                    }
                    key={index}
                  ></Card>
                ))}
            </div>
          )}
        </TabPane>
      </Tabs>

      <Modal
        title={`Transfer ${nftToSend?.name || "NFT"}`}
        visible={visible}
        onCancel={() => setVisibility(false)}
        onOk={handleTransfer}
        confirmLoading={isPending}
        okText="Send"
      >
        <AddressInput
          autoFocus
          placeholder="Receiver"
          onChange={setReceiver}
        />
      </Modal>
    </>
  );
}

const NFTMetaModal = ({
  isNFTMetaModalVisible,
  setIsNFTMetaModalVisible,
  metadata,
  token_uri,
}) => {
  const [playConfirmation] = useSound(Confirmation);

  const mintedAt = new Date(metadata?.minted_at);
  const image = metadata?.image.split("/");
  const piece = metadata?.piece.split("/");

  function success() {
    Modal.success({
      title: "The Skin is set successfully.",
    });
  }

  function fail() {
    Modal.error({
      title: "Something went wrong",
      content: "Please try again",
    });
  }

  useEffect(() => {
    if (metadata) {
      success();
    }
  }, [metadata]);

  const formatAMPM = () => {
    let hours = mintedAt.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const strTime = hours + ampm;
    return strTime;
  };

  const { confirm } = Modal;

  function showSetConfirm() {
    confirm({
      title: "Do you Want to set this NFT as Piece Skin?",
      icon: <CheckCircleOutlined />,
      content: "by clicking yes you will set this NFT as the piece skin",
      okText: "Yes",
      okType: "success",
      cancelText: "No",
      onOk: () => {
        // setPieceSkin(); // Update this if you have a method to handle this
      },
      onCancel: () => {
        console.log("Cancel");
        setIsNFTMetaModalVisible(false);
      },
    });
  }

  function showDeleteConfirm() {
    confirm({
      title: "Do you Want to remove this NFT as Piece Skin?",
      icon: <WarningOutlined />,
      content: "by clicking yes you will remove this NFT as the piece skin",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        // removePieceSkin(); // Update this if you have a method to handle this
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  }

  return (
    <Modal
      visible={isNFTMetaModalVisible}
      footer={null}
      onCancel={() => setIsNFTMetaModalVisible(false)}
    >
      <h1>Token Metadata</h1>
      <p><b>Token URI:</b> {token_uri}</p>
      <p><b>Piece:</b> {piece ? piece.join("/") : "N/A"}</p>
      <p><b>Minted At:</b> {mintedAt.toDateString()} {formatAMPM()}</p>
      <Image src={metadata?.image || "error"} />
      <p>
        <a href={metadata?.external_url || "#"} target="_blank" rel="noopener noreferrer">
          View on OpenSea
        </a>
      </p>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <a
          href="#"
          onClick={() => {
            playConfirmation();
            showSetConfirm();
          }}
        >
          Set As Piece Skin
        </a>
        <a
          href="#"
          onClick={() => {
            playConfirmation();
            showDeleteConfirm();
          }}
        >
          Remove As Piece Skin
        </a>
      </div>
    </Modal>
  );
};

const NFTCard = ({ token_id, token_uri, setNftToSend, setVisibility, skinData }) => {
  const [isNFTMetaModalVisible, setIsNFTMetaModalVisible] = useState(false);
  const [metadata, setMetadata] = useState(null);

  async function fetchNFTMetadata() {
    // Fetch metadata based on token_uri
    try {
      const response = await fetch(token_uri);
      const data = await response.json();
      setMetadata(data);
    } catch (error) {
      console.error("Failed to fetch metadata:", error);
    }
  }

  return (
    <>
      <Card
        hoverable
        style={{ width: 300, border: "2px solid #e7eaf3" }}
        cover={<Image preview={false} src={metadata?.image || "error"} fallback="data:image/png;base64,..." />}
        actions={[
          <Tooltip title="Transfer NFT">
            <SendOutlined
              onClick={() => {
                setNftToSend({ token_id, name: metadata?.name });
                setVisibility(true);
              }}
            />
          </Tooltip>,
          <Tooltip title="View Metadata">
            <FileSearchOutlined
              onClick={() => {
                fetchNFTMetadata();
                setIsNFTMetaModalVisible(true);
              }}
            />
          </Tooltip>,
        ]}
      >
        <Meta title={metadata?.name || "NFT"} description={`Token ID: ${token_id}`} />
      </Card>
      {metadata && (
        <NFTMetaModal
          isNFTMetaModalVisible={isNFTMetaModalVisible}
          setIsNFTMetaModalVisible={setIsNFTMetaModalVisible}
          metadata={metadata}
          token_uri={token_uri}
        />
      )}
    </>
  );
};

export default NFTBalance;

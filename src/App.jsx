import React, { useState } from "react";
import MyGroup from "./components/MyGroup.jsx";
import walletConnectFcn from "./components/hedera/walletConnect.js";
import tokenCreateFcn from "./components/hedera/tokenCreate.js";
import assotoken from "./components/hedera/AssociateToken.js";
import tokenMintFcn from "./components/hedera/tokenMint.js";
import contractDeployFcn from "./components/hedera/contractDeploy.js";
import contractExecuteFcn from "./components/hedera/contractExecute.js";
import tokenTransferfcn from "./components/hedera/buythenft.js";
import "./styles/App.css";

function App() {
  const [walletData, setWalletData] = useState();
  const [accountId, setAccountId] = useState();
  const [tokenId, setTokenId] = useState();

  const [tokenSupply, setTokenSupply] = useState();
  const [contractId, setContractId] = useState();

  const [connectTextSt, setConnectTextSt] = useState("🔌 Connect here...");
  const [createTextSt, setCreateTextSt] = useState("");
  const [mintTextSt, setMintTextSt] = useState("");
  const [nftTextSt,setnftTextSt] = useState("")
  const [contractTextSt, setContractTextSt] = useState();
  const [trasnferTextSt, setTransferTextSt] = useState();

  const [connectLinkSt, setConnectLinkSt] = useState("");
  const [createLinkSt, setCreateLinkSt] = useState("");
  const [mintLinkSt, setMintLinkSt] = useState("");
  const [nftLinkSt,setnftLinkst]=useState("")


  const [contractLinkSt, setContractLinkSt] = useState();
  const [trasnferLinkSt, setTransferLinkSt] = useState();

  async function connectWallet() {
    if (accountId !== undefined) {
      setConnectTextSt(`🔌 Account ${accountId} already connected ⚡ ✅`);
    } else {
      const wData = await walletConnectFcn();
      wData[0].pairingEvent.once((pairingData) => {
        pairingData.accountIds.forEach((id) => {
          setAccountId(id);
          console.log(`- Paired account id: ${id}`);
          setConnectTextSt(`🔌 Account ${id} connected ⚡ ✅`);
          setConnectLinkSt(`https://hashscan.io/#/testnet/account/${id}`);
        });
      });
      setWalletData(wData);
      console.log(wData);

      setCreateTextSt();
    }
  }

  

  async function tokenCreate() {
    if (tokenId !== undefined) {
      setCreateTextSt(`You already have token ${tokenId} ✅`);
    } else if (accountId === undefined) {
      setCreateTextSt(`🛑 Connect a wallet first! 🛑`);
    } else {
      const [tId, supply, txIdRaw] = await tokenCreateFcn(
        walletData,
        accountId
      );
      setTokenId(tId);
      setTokenSupply(supply);
      setCreateTextSt(`Successfully created token with ID: ${tId} ✅`);
      setMintTextSt();
      setContractTextSt();
      setTransferTextSt();
      const txId = prettify(txIdRaw);
      setCreateLinkSt(`https://hashscan.io/#/testnet/transaction/${txId}`);
    }
  }

  async function tokenMint() {
    if (tokenId === undefined) {
      setMintTextSt("🛑 Create a token first! 🛑");
    } else {
      const [supply, txIdRaw] = await tokenMintFcn(
        walletData,
        accountId,
        tokenId
      );
      setTokenSupply(supply);
      setMintTextSt(`Supply of token ${tokenId} is ${supply}! ✅`);
      const txId = prettify(txIdRaw);
      setMintLinkSt(`https://hashscan.io/#/testnet/transaction/${txId}`);
    }
  }


  async function asstoken() {

    const [supply, txIdRaw] = await assotoken(
      walletData,
      accountId,
    // tokenId
    );
    setTokenSupply(supply);
    setMintTextSt(`Supply of token ${tokenId} is ${supply}! ✅`);
    const txId = prettify(txIdRaw);
    setMintLinkSt(`https://hashscan.io/#/testnet/transaction/${txId}`);
      
    // if (tokenId === undefined) {
    //   setnftTextSt("🛑 Create a token first! 🛑");
    // } else {
      
    //   const [supply, txIdRaw] = await assotoken(
    //     walletData,
    //     accountId,
    //     tokenId
    //   );
    //   setTokenSupply(supply);
    //   setMintTextSt(`Supply of token ${tokenId} is ${supply}! ✅`);
    //   const txId = prettify(txIdRaw);
    //   setMintLinkSt(`https://hashscan.io/#/testnet/transaction/${txId}`);
    // }
  }


  async function tokenTransfer() {
      const Tid = process.env.REACT_APP_OPERATOR_ID
      const Tkey = process.env.REACT_APP_OPERATOR_PVKEY
      const Aid = process.env.REACT_APP_ALICE_ID
     
      const [] = await tokenTransferfcn(
        walletData,
        accountId,
        Tid,
        Tkey,
        Aid

      );
      setConnectTextSt(`🔌 NFt transfer ⚡ ✅`);
      // setTokenId(tId);
      // setTokenSupply(supply);
      // setCreateTextSt(`Successfully transfer nft with ID: ${tId} ✅`);
      // setMintTextSt();
      // setContractTextSt();
      // setTransferTextSt();
      // const txId = prettify(txIdRaw);
      // setCreateLinkSt(`https://hashscan.io/#/testnet/transaction/${txId}`);
    

    
  }







  async function contractDeploy() {
    if (tokenId === undefined) {
      setContractTextSt("🛑 Create a token first! 🛑");
    } else if (contractId !== undefined) {
      setContractTextSt(`You already have contract ${contractId} ✅`);
    } else {
      const [cId, txIdRaw] = await contractDeployFcn(
        walletData,
        accountId,
        tokenId
      );
      setContractId(cId);
      setContractTextSt(
        `Successfully deployed smart contract with ID: ${cId} ✅`
      );
      setTransferTextSt();
      const txId = prettify(txIdRaw);
      setContractLinkSt(`https://hashscan.io/#/testnet/transaction/${txId}`);
    }
  }

  async function contractExecute() {
    tokenId = 1
    contractId=1
    if (tokenId === undefined || contractId === undefined) {
      setTransferTextSt("🛑 Create a token AND deploy a contract first! 🛑");
    } else {
      const txIdRaw = await contractExecuteFcn(
        walletData,
        accountId,
        tokenId,
        contractId
      );
      setTransferTextSt(`🎉🎉🎉 Great job! You completed the demo 🎉🎉🎉`);
      const txId = prettify(txIdRaw);
      setTransferLinkSt(`https://hashscan.io/#/testnet/transaction/${txId}`);
    }
  }

  function prettify(txIdRaw) {
    const a = txIdRaw.split("@");
    const b = a[1].split(".");
    return `${a[0]}-${b[0]}-${b[1]}`;
  }

  return (
    <div className="App">
      <h1 className="header">OneTo11 NFTMarketplace</h1>
      <MyGroup
        fcn={connectWallet}
        buttonLabel={"Connect Wallet"}
        text={connectTextSt}
        link={connectLinkSt}
      />

      {/* <MyGroup
        fcn={tokenCreate}
        buttonLabel={"Create New Token"}
        text={createTextSt}
        link={createLinkSt}
      />  */}
{/*  
      {/* <MyGroup
        fcn={tokenMint}
        buttonLabel={"Mint 10 New Tokens"}
        text={mintTextSt}
        link={mintLinkSt}
      /> */}
      {/* working on tokenmint */}
	   {/* <MyGroup
        // fcn={main}
        buttonLabel={"Create NFT"}
        // text={nftTextSt}
        // link={nftLinkSt}
      />  */}
	    {/* <MyGroup
        // fcn={Addnft}
        buttonLabel={"Associate NFT"}
        // text={nftTextSt}
        // link={nftLinkSt}
      />  */}
  {/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */}
  ``<MyGroup
        fcn={asstoken}
        buttonLabel={"Associate Token"}
        text={nftTextSt}
        link={nftLinkSt}
      /> 

  <MyGroup
        fcn={tokenTransfer}
        buttonLabel={"Buy NFT"}
        text={createTextSt}
        link={createLinkSt}
      /> 





  {/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */}



	{/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}
      {/* <MyGroup
        fcn={contractDeploy}
        buttonLabel={"Deploy Contract"}
        text={contractTextSt}
        link={contractLinkSt}
      />  */}

      {/* <MyGroup
        fcn={tokenTransfer}
        // buttonLabel={"BUY NFT"}
        text={trasnferTextSt}
        link={trasnferLinkSt}
      /> */}
      <div className="logo">
        <div className="symbol">
          <svg
            id="Layer_1"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 40 40"
          >
            <path
              d="M20 0a20 20 0 1 0 20 20A20 20 0 0 0 20 0"
              className="circle"
            ></path>
            <path
              d="M28.13 28.65h-2.54v-5.4H14.41v5.4h-2.54V11.14h2.54v5.27h11.18v-5.27h2.54zm-13.6-7.42h11.18v-2.79H14.53z"
              className="h"
            ></path>
          </svg>
        </div>
        <span>Hedera</span>
      </div>
    </div>
  );
}
export default App;

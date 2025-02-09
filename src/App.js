import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import MusicNFT from "./MusicNFT.json"; // Ensure ABI is in the src directory

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your deployed address

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [file, setFile] = useState(null);
  const [ipfsUri, setIpfsUri] = useState("");

  useEffect(() => {
    async function loadBlockchain() {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, MusicNFT.abi, signer);
        setContract(contract);

        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);
      } else {
        alert("Please install MetaMask!");
      }
    }

    loadBlockchain();
  }, []);

  const uploadToIPFS = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://127.0.0.1:5000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.metadata_uri) {
      setIpfsUri(data.metadata_uri);
      alert("File uploaded to IPFS!");
    } else {
      alert("Upload failed!");
    }
  };

  const mintNFT = async () => {
    if (!contract) return;
    try {
      const tx = await contract.mintNFT(account, ipfsUri);
      await tx.wait();
      alert("NFT Minted Successfully!");
    } catch (error) {
      console.error("Minting Failed", error);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>AI-Generated NFT Music Platform</h1>
      <p>Connected Account: {account || "Not Connected"}</p>

      <input 
        type="file" 
        onChange={(e) => setFile(e.target.files[0])} 
        style={{ padding: "10px" }} 
      />
      <button onClick={uploadToIPFS} style={{ marginLeft: "10px", padding: "10px" }}>
        Upload to IPFS
      </button>

      {ipfsUri && (
        <>
          <p>IPFS URI: {ipfsUri}</p>
          <button onClick={mintNFT} style={{ padding: "10px" }}>
            Mint NFT
          </button>
        </>
      )}
    </div>
  );
}

export default App;

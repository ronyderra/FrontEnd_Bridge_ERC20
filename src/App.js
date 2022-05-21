import "./App.css";
import binanceAbi from "./contractsAbi/binance.json";
import binanceAddress from "./contractsAbi/binanceAddress.json";
import iocAbi from "./contractsAbi/ioc.json";
import iocAddress from "./contractsAbi/iocAddress.json";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

function App() {
  const [account, setAccount] = useState(null);
  const [binanceContract, setBinanceContract] = useState({});
  const [iocContract, setIOcContract] = useState({});
  const [bnbAmount, setBnbAmount] = useState("");
  const [iocAmount, setIocAmount] = useState("");

  useEffect(() => {
    web3Handler();
  }, []);

  const web3Handler = async () => {
    const resProvider = await new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await resProvider.send("eth_requestAccounts", []);
    const resSigner = await resProvider.getSigner();

    setAccount(accounts[0]);

    window.ethereum.on("chainChanged", (chainId) => {
      console.log("chain changed");
      window.location.reload();
    });

    window.ethereum.on("accountsChanged", async function (accounts) {
      console.log("account changed");
      setAccount(accounts[0]);
      await web3Handler();
    });
    loadContracts(resSigner);
  };

  const loadContracts = async (signer) => {
    const binance = new ethers.Contract(binanceAddress.address, binanceAbi.abi, signer);
    const ioc = new ethers.Contract(iocAddress.address, iocAbi.abi, signer);
    setBinanceContract(binance);
    setIOcContract(ioc);
  };



  const binanceLockFunds = async (event) => {
    event.preventDefault();
    await binanceContract.transfer("0x48eFC8ABb7FA201D85e18609f0fB560A412caf6D", bnbAmount);
  };

  const iocBurn = async (event) => {
    event.preventDefault();
    await iocContract.burn(iocAmount);
  };

  return (
    <div className="App">
      {/* <br />
      <input type={"number"} value={amount} onChange={(e) => setAmount(e.target.value)} />
      <br />
      <button onClick={handleChange}>cchange</button>
      <br />
      <button onClick={binanceLockFunds}>convert to ioc</button>
      <br />
      <br />
      <button onClick={iocBurn}>convert to bnb2 </button>
      <br /> <br /> */}
          <br /> <br />

      <form onSubmit={iocBurn}>
        <label>
          Enter amout of IOC to convert <br /><br />
          <input
            type="number"
            value={iocAmount}
            onChange={(e) => setIocAmount(e.target.value)}
          />
          <br /> <br />
        </label>
        <input type="submit" />
      </form>
      <br /> <br />

      <form onSubmit={binanceLockFunds}>
        <label>
          Enter amout of BNB2 to convert <br /><br />
          <input
            type="number"
            value={bnbAmount}
            onChange={(e) => setBnbAmount(e.target.value)}
          />
          <br /> <br />
        </label>
        <input type="submit" />
      </form>
    </div>
  );
}

export default App;

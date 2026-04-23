import { useState, useCallback } from "react";
import { ethers } from "ethers";

const MONAD_CHAIN_ID = "0x279F"; // 10143
const MONAD_RPC = import.meta.env.VITE_MONAD_RPC || "https://testnet-rpc.monad.xyz";
const RECEIVER = import.meta.env.VITE_RECEIVER_ADDRESS || "0x0000000000000000000000000000000000000001";

export function useMonad() {
  const [account, setAccount] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setError("MetaMask bulunamadı. Lütfen MetaMask yükle.");
      return null;
    }
    setIsConnecting(true);
    setError(null);
    try {
      // Monad testnet ekle
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: MONAD_CHAIN_ID,
            chainName: "Monad Testnet",
            rpcUrls: [MONAD_RPC],
            nativeCurrency: { name: "MON", symbol: "MON", decimals: 18 },
            blockExplorerUrls: ["https://testnet.monadexplorer.com"],
          }],
        });
      } catch {
        // Zincir zaten ekli olabilir, devam et
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      return accounts[0];
    } catch (err) {
      setError("Bağlantı reddedildi: " + err.message);
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const sendTx = useCallback(async (tokensUsed) => {
    if (!window.ethereum || !account) return null;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // tokens_used * 0.000000001 MON (minimum anlamlı miktar)
      const amountInWei = ethers.parseEther(
        (tokensUsed * 0.000000001).toFixed(18)
      );

      const tx = await signer.sendTransaction({
        to: RECEIVER,
        value: amountInWei,
      });

      return tx.hash;
    } catch (err) {
      console.error("TX hatası:", err.message);
      return null;
    }
  }, [account]);

  return { account, connect, sendTx, isConnecting, error };
}

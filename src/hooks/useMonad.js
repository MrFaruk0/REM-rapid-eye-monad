import { useState, useCallback, useEffect } from "react";
import { ethers } from "ethers";

const MONAD_CHAIN_ID = "0x279F"; // 10143
const MONAD_RPC = import.meta.env.VITE_MONAD_RPC || "https://testnet-rpc.monad.xyz";
const RECEIVER = import.meta.env.VITE_RECEIVER_ADDRESS || "0x0000000000000000000000000000000000000001";

export function useMonad() {
  const [account, setAccount] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Sayfa yenilenince otomatik yeniden bağlan
  useEffect(() => {
    if (!window.ethereum) return;
    window.ethereum
      .request({ method: "eth_accounts" })
      .then((accounts) => {
        if (accounts.length > 0) setAccount(accounts[0]);
      })
      .catch(() => {});

    // Hesap değişikliğini dinle
    const handleAccountsChanged = (accounts) => {
      setAccount(accounts.length > 0 ? accounts[0] : null);
    };
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    return () => window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
  }, []);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setError("MetaMask bulunamadı.");
      return null;
    }
    setIsConnecting(true);
    setError(null);
    try {
      // Monad testnet ekle / switch et
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
        // zaten ekli
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      return accounts[0];
    } catch (err) {
      setError("Bağlantı reddedildi.");
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAccount(null);
  }, []);

  // Her aktivite başına 0.000001 MON (demo için görünür miktar)
  const sendTx = useCallback(async (tokensUsed) => {
    if (!window.ethereum) return null;
    const acc = account || (await window.ethereum.request({ method: "eth_accounts" }))[0];
    if (!acc) return null;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      // 0.000001 MON * tokensUsed/100 — MetaMask'ta görünür olacak kadar
      const amount = Math.max(tokensUsed * 0.000001, 0.000001);
      const amountWei = ethers.parseEther(amount.toFixed(18).replace(/\.?0+$/, "").slice(0, 20));
      const tx = await signer.sendTransaction({ to: RECEIVER, value: amountWei });
      await tx.wait(1); // 1 blok bekle
      return tx.hash;
    } catch (err) {
      console.warn("TX hatası:", err.message);
      return null;
    }
  }, [account]);

  return { account, connect, disconnect, sendTx, isConnecting, error };
}

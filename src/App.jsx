import { useEffect, useState } from "react";
import { useMonad } from "./hooks/useMonad";
import { useBrain } from "./hooks/useBrain";
import ConnectPage from "./components/ConnectPage";
import BrainAvatar from "./components/BrainAvatar";
import MapGrid from "./components/MapGrid";
import AgentChat from "./components/AgentChat";
import TokenBar from "./components/TokenBar";
import DailyTask from "./components/DailyTask";
import DreamHistory from "./components/DreamHistory";
import Marketplace from "./components/Marketplace";
import "./index.css";

const GUEST = "guest"; // demo modunda sahte account

/* ── Küçük arka plan noktaları ── */
function BgDots() {
  return (
    <svg style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, opacity: 0.035 }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="bgdots" width="28" height="28" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="#6d28d9" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#bgdots)" />
    </svg>
  );
}

export default function App() {
  const { account, connect, disconnect, sendTx, isConnecting, error: monadError } = useMonad();
  const [guestMode, setGuestMode] = useState(false);

  // Aktif kimlik: MetaMask account veya guest modu
  const activeAccount = account || (guestMode ? GUEST : null);
  // TX sadece gerçek MetaMask ile
  const activeSendTx = account ? sendTx : null;
  const {
    events, logs, tokenTotal, isNight, currentDream,
    dreams, dailyTask, taskCompleted, isProcessing,
    selectActivity, wakeUp, tokenLimit,
    sleepQuality, prevTier, mintNft, buyMarketplaceItem,
    contractAddress, deployNftContract
  } = useBrain(activeSendTx);

  const [nightOverlay, setNightOverlay] = useState(false);
  const [showMarket, setShowMarket] = useState(false);

  useEffect(() => {
    if (isNight) { setNightOverlay(true); const t = setTimeout(() => setNightOverlay(false), 2200); return () => clearTimeout(t); }
  }, [isNight]);

  // Cüzdan bağlı değil ve guest mod da seçilmediyse ConnectPage göster
  if (!activeAccount) {
    return (
      <ConnectPage
        onConnect={connect}
        onGuest={() => setGuestMode(true)}
        isConnecting={isConnecting}
        error={monadError}
      />
    );
  }

  const tokenPct = Math.min((tokenTotal / tokenLimit) * 100, 100);

  return (
    <div style={{ minHeight: "100vh", background: isNight ? "#060609" : "var(--bg)", transition: "background 1.2s", position: "relative" }}>
      <BgDots />

      {/* Gece geçiş overlay */}
      {nightOverlay && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 200, pointerEvents: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(234,88,12,0.06)",
          animation: "fadeIn 0.4s ease",
        }}>
          <div style={{
            fontSize: "36px", fontWeight: "800", color: "#ea580c",
            letterSpacing: "3px", animation: "nightSlide 0.5s ease",
            textShadow: "0 0 40px rgba(234,88,12,0.6)",
          }}>
            🌙 GECE BAŞLIYOR
          </div>
        </div>
      )}

      {/* ══════════ MAIN ══════════ */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: "1360px", margin: "0 auto", padding: "0 24px 48px" }}>

        {/* ── HEADER ── */}
        <header style={{
          display: "flex", alignItems: "center", gap: "20px",
          padding: "18px 0 20px",
          borderBottom: "1px solid var(--border)",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginRight: "auto" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: "linear-gradient(135deg, #6d28d9, #4c1d95)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "19px",
            }}>🧠</div>
            <div>
              <div style={{ fontSize: "17px", fontWeight: "800", color: "var(--text)", letterSpacing: "-0.3px" }}>
                Brain <span style={{ color: "#6d28d9" }}>Agent</span>
              </div>
              <div style={{ fontSize: "10px", color: "var(--text-3)", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                Monad Testnet
              </div>
            </div>
          </div>

          {/* Token bar & Uyku Kalitesi */}
          <div style={{ minWidth: "220px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <TokenBar tokenTotal={tokenTotal} limit={tokenLimit} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "11px", color: "var(--text-2)", fontWeight: "600" }}>
              <span>Uyku Kalitesi: <span style={{ color: sleepQuality > 80 ? "#10b981" : sleepQuality < 40 ? "#ef4444" : "#f59e0b" }}>{sleepQuality}</span>/100</span>
              <button 
                onClick={() => setShowMarket(true)}
                style={{ 
                  background: "linear-gradient(135deg, #7c3aed, #4f46e5)", border: "none", 
                  borderRadius: "6px", color: "#fff", fontSize: "12px", fontWeight: "700",
                  cursor: "pointer", padding: "4px 12px", boxShadow: "0 2px 8px rgba(124, 58, 237, 0.4)",
                  transition: "all 0.2s" 
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              >
                🛒 Market
              </button>
            </div>
          </div>

          {/* Account / Guest badge */}
          {account ? (
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "7px 12px",
              background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px",
            }}>
              <div style={{
                width: "7px", height: "7px", borderRadius: "50%", background: "#16a34a",
                boxShadow: "0 0 5px #16a34a", animation: "pulse 2s ease-in-out infinite",
              }} />
              <span style={{ fontSize: "12px", fontFamily: "monospace", color: "#a5b4fc" }}>
                {account.slice(0, 6)}…{account.slice(-4)}
              </span>
              <button onClick={disconnect} title="Bağlantıyı kes" style={{ marginLeft: "4px", background: "none", border: "none", color: "var(--text-2)", cursor: "pointer", fontSize: "12px", lineHeight: 1 }}>✕</button>
            </div>
          ) : (
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "7px 12px",
              background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px",
            }}>
              <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#64748b" }} />
              <span style={{ fontSize: "12px", color: "var(--text-2)" }}>Demo Modu</span>
              <button onClick={() => setGuestMode(false)} title="Çık" style={{ marginLeft: "4px", background: "none", border: "none", color: "var(--text-2)", cursor: "pointer", fontSize: "12px", lineHeight: 1 }}>✕</button>
            </div>
          )}
        </header>

        {/* ── AVATAR + TASK ROW ── */}
        <div style={{ display: "flex", gap: "20px", alignItems: "center", marginBottom: "20px", flexWrap: "wrap" }}>
          <BrainAvatar isNight={isNight} isProcessing={isProcessing} />

          {/* Daily Task & Deploy Button */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "flex-end" }}>
            <DailyTask task={dailyTask} isCompleted={taskCompleted} />
            
            {activeAccount && activeAccount !== GUEST && !contractAddress && (
              <button
                onClick={deployNftContract}
                style={{
                  background: "rgba(245, 158, 11, 0.1)", border: "1px solid #f59e0b",
                  borderRadius: "8px", color: "#f59e0b", fontSize: "11px", fontWeight: "700",
                  padding: "6px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
                  animation: "pinPulse 2s infinite"
                }}
              >
                ⚙️ NFT Contract Kurulumu Yap
              </button>
            )}
            {contractAddress && (
              <div style={{ fontSize: "10px", color: "#10b981", fontWeight: "600" }}>
                ✅ NFT Contract: {contractAddress.slice(0,6)}...{contractAddress.slice(-4)}
              </div>
            )}
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: "10px" }}>
            {[
              { v: events.length, l: "Aktivite", c: "#6d28d9" },
              { v: logs.length,   l: "Log",      c: "#2563eb" },
              { v: dreams.length, l: "Rüya",     c: "#ea580c" },
            ].map(s => (
              <div key={s.l} style={{
                padding: "10px 14px", background: "var(--surface)",
                border: "1px solid var(--border)", borderRadius: "12px", textAlign: "center", minWidth: "64px",
              }}>
                <div style={{ fontSize: "22px", fontWeight: "800", color: s.c, fontFamily: "monospace", lineHeight: 1.1 }}>{s.v}</div>
                <div style={{ fontSize: "10px", color: "var(--text-2)", marginTop: "2px" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── MAP + INNER VOICE ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "18px", padding: "20px" }}>
            <MapGrid
              onActivitySelect={selectActivity}
              isProcessing={isProcessing}
              isNight={isNight}
              tokenLimitReached={tokenTotal >= tokenLimit}
            />
          </div>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "18px", padding: "20px" }}>
            <AgentChat logs={logs} />
          </div>
        </div>

        {/* ── DREAM HISTORY ── */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "18px", padding: "24px" }}>
          <DreamHistory dreams={dreams} currentDream={currentDream} onMintNft={mintNft} />
        </div>

        {/* ── WAKE UP BUTTON (gece bittikten sonra) ── */}
        {isNight && currentDream && (
          <div style={{ textAlign: "center", marginTop: "24px", animation: "fadeIn 0.6s ease" }}>
            <button
              id="wake-up-btn"
              onClick={wakeUp}
              style={{
                padding: "14px 40px",
                background: "linear-gradient(135deg, #ea580c, #c2410c)",
                border: "none", borderRadius: "14px",
                color: "#fff", fontSize: "15px", fontWeight: "700",
                cursor: "pointer", letterSpacing: "0.5px",
                boxShadow: "0 6px 24px rgba(234,88,12,0.4)",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(234,88,12,0.5)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(234,88,12,0.4)"; }}
            >
              ☀️ Uyan — Yeni Güne Başla
            </button>
            <p style={{ marginTop: "10px", fontSize: "12px", color: "var(--text-2)" }}>
              Tokenler sıfırlanır, yeni görev gelir.
            </p>
          </div>
        )}

        {/* ── FOOTER ── */}
        <footer style={{ marginTop: "32px", textAlign: "center", fontSize: "11px", color: "var(--text-3)", letterSpacing: "1px" }}>
          Brain Agent · Monad Blitz Hackathon · Vite + React + Hardhat + ethers.js
        </footer>
      </div>

      {showMarket && (
        <Marketplace onClose={() => setShowMarket(false)} onBuy={buyMarketplaceItem} />
      )}
    </div>
  );
}

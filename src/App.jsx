import { useState, useEffect } from "react";
import { useMonad } from "./hooks/useMonad";
import { useBrain } from "./hooks/useBrain";
import BrainAvatar from "./components/BrainAvatar";
import MapGrid from "./components/MapGrid";
import InnerVoicePanel from "./components/InnerVoicePanel";
import TokenBar from "./components/TokenBar";
import DailyTask from "./components/DailyTask";
import DreamHistory from "./components/DreamHistory";
import "./index.css";

// Arka plan parçacıkları
function Particles({ count = 30, isNight }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 4,
    dur: Math.random() * 3 + 2,
  }));

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      pointerEvents: "none",
      zIndex: 0,
      overflow: "hidden",
    }}>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: "50%",
            background: isNight
              ? `rgba(249,115,22,${0.3 + Math.random() * 0.4})`
              : `rgba(124,58,237,${0.2 + Math.random() * 0.3})`,
            animation: `twinkle ${p.dur}s ease-in-out ${p.delay}s infinite, float ${p.dur + 1}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export default function App() {
  const { account, connect, sendTx, isConnecting, error: monadError } = useMonad();
  const {
    events,
    logs,
    tokenTotal,
    isNight,
    currentDream,
    dreams,
    dailyTask,
    taskCompleted,
    isProcessing,
    selectActivity,
  } = useBrain(account ? sendTx : null);

  const [showNightOverlay, setShowNightOverlay] = useState(false);

  // Gece modu overlay efekti
  useEffect(() => {
    if (isNight) {
      setShowNightOverlay(true);
      const t = setTimeout(() => setShowNightOverlay(false), 2000);
      return () => clearTimeout(t);
    }
  }, [isNight]);

  const tokenLimitReached = tokenTotal >= 500;

  return (
    <div style={{
      minHeight: "100vh",
      background: isNight
        ? "radial-gradient(ellipse at top, #1a0a00 0%, #070711 50%)"
        : "radial-gradient(ellipse at top, #0d0520 0%, #070711 60%)",
      position: "relative",
      transition: "background 1s ease",
    }}>
      {/* Arka plan parçacıkları */}
      <Particles count={25} isNight={isNight} />
      <div className="noise-overlay" />

      {/* Gece geçiş overlay */}
      {showNightOverlay && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(249,115,22,0.08)",
          zIndex: 100,
          animation: "fadeIn 0.5s ease-in, fadeIn 1s ease-out reverse 1s",
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <div style={{
            fontSize: "48px",
            fontWeight: "900",
            color: "#f97316",
            letterSpacing: "4px",
            textShadow: "0 0 40px rgba(249,115,22,0.8)",
            animation: "pulse 0.5s ease-in-out infinite",
          }}>
            🌙 GECE BAŞLIYOR
          </div>
        </div>
      )}

      {/* ═══════════════ MAIN CONTENT ═══════════════ */}
      <div style={{
        position: "relative",
        zIndex: 1,
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "0 24px 40px",
      }}>

        {/* ── HEADER ── */}
        <header style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 0 24px",
          borderBottom: "1px solid var(--border)",
          marginBottom: "24px",
          gap: "20px",
          flexWrap: "wrap",
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #7c3aed, #4c1d95)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
            }}>
              🧠
            </div>
            <div>
              <div style={{
                fontSize: "20px",
                fontWeight: "800",
                letterSpacing: "-0.5px",
                fontFamily: "'Space Grotesk', sans-serif",
              }}>
                <span className="text-gradient">BRAIN</span>
                <span style={{ color: "var(--text)" }}> AGENT</span>
              </div>
              <div style={{ fontSize: "10px", color: "var(--muted)", letterSpacing: "2px" }}>
                MONAD TESTNET · AI NEURAL SIM
              </div>
            </div>
          </div>

          {/* Token Bar */}
          <div style={{ flex: 1, maxWidth: "300px" }}>
            <TokenBar tokenTotal={tokenTotal} limit={500} />
          </div>

          {/* MetaMask bağlantı */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
            {!account ? (
              <button
                id="connect-wallet-btn"
                onClick={connect}
                disabled={isConnecting}
                style={{
                  padding: "10px 20px",
                  background: "linear-gradient(135deg, #7c3aed, #5b21b6)",
                  border: "none",
                  borderRadius: "10px",
                  color: "#fff",
                  fontWeight: "700",
                  fontSize: "13px",
                  cursor: isConnecting ? "wait" : "pointer",
                  transition: "all 0.2s",
                  boxShadow: "0 4px 15px rgba(124,58,237,0.4)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(124,58,237,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(124,58,237,0.4)";
                }}
              >
                {isConnecting ? "⏳ Bağlanıyor..." : "🦊 MetaMask Bağla"}
              </button>
            ) : (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 14px",
                background: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.3)",
                borderRadius: "10px",
              }}>
                <div style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#22c55e",
                  boxShadow: "0 0 6px #22c55e",
                  animation: "pulse 1.5s ease-in-out infinite",
                }} />
                <span style={{
                  fontSize: "12px",
                  fontFamily: "monospace",
                  color: "#22c55e",
                  fontWeight: "600",
                }}>
                  {account.slice(0, 6)}...{account.slice(-4)}
                </span>
              </div>
            )}
            {monadError && (
              <span style={{ fontSize: "11px", color: "#ef4444", maxWidth: "220px", textAlign: "right" }}>
                ⚠️ {monadError}
              </span>
            )}
          </div>
        </header>

        {/* ── AVATAR + DAILY TASK ── */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "24px",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}>
          <BrainAvatar isNight={isNight} isProcessing={isProcessing} />
          <div style={{ flex: 1, minWidth: "280px" }}>
            <DailyTask task={dailyTask} taskCompleted={taskCompleted} />
          </div>

          {/* Stats */}
          <div style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
          }}>
            {[
              { label: "Aktivite", value: events.length, icon: "⚡" },
              { label: "Log", value: logs.length, icon: "📡" },
              { label: "Rüya", value: dreams.length, icon: "🌙" },
            ].map((stat) => (
              <div key={stat.label} style={{
                padding: "12px 16px",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                textAlign: "center",
                minWidth: "70px",
              }}>
                <div style={{ fontSize: "18px" }}>{stat.icon}</div>
                <div style={{
                  fontSize: "20px",
                  fontWeight: "800",
                  color: "var(--purple-light)",
                  fontFamily: "monospace",
                  lineHeight: 1.2,
                }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: "10px", color: "var(--muted)" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── MAIN GRID: MapGrid + InnerVoice ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "24px",
        }}>
          {/* Sol: MapGrid */}
          <div style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "20px",
            padding: "20px",
          }}>
            <MapGrid
              onActivitySelect={selectActivity}
              isProcessing={isProcessing}
              isNight={isNight}
              tokenLimitReached={tokenLimitReached}
            />
          </div>

          {/* Sağ: InnerVoice */}
          <div style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "20px",
            padding: "20px",
          }}>
            <InnerVoicePanel logs={logs} />
          </div>
        </div>

        {/* ── DREAM HISTORY ── */}
        <div style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "20px",
          padding: "24px",
        }}>
          <DreamHistory dreams={dreams} currentDream={currentDream} />
        </div>

        {/* ── FOOTER ── */}
        <footer style={{
          marginTop: "24px",
          textAlign: "center",
          color: "var(--muted)",
          fontSize: "11px",
          letterSpacing: "1px",
        }}>
          BRAIN AGENT · MONAD BLITZ HACKATHON · Built with React + ethers.js + OpenRouter
        </footer>
      </div>
    </div>
  );
}

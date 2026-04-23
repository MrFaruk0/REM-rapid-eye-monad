import { useEffect, useRef } from "react";

const AGENT_STYLES = {
  Logic: { color: "#3b82f6", bg: "rgba(59,130,246,0.12)", label: "LOGIC" },
  Memory: { color: "#a78bfa", bg: "rgba(167,139,250,0.12)", label: "MEMORY" },
  Dream: { color: "#f97316", bg: "rgba(249,115,22,0.12)", label: "DREAM" },
  TX: { color: "#22c55e", bg: "rgba(34,197,94,0.12)", label: "TX" },
  System: { color: "#64748b", bg: "rgba(100,116,139,0.10)", label: "SYS" },
};

export default function InnerVoicePanel({ logs }) {
  const bottomRef = useRef(null);

  // Yeni log gelince scroll (yukarı ekliyoruz, ilk eleman en yeni)
  useEffect(() => {
    // logs[0] en yeni, scroll top
  }, [logs]);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      minHeight: "400px",
    }}>
      <h3 style={{
        fontSize: "12px",
        fontWeight: "700",
        color: "var(--muted)",
        letterSpacing: "2px",
        textTransform: "uppercase",
        margin: "0 0 12px 0",
      }}>
        🧠 İç Ses Kanalı
      </h3>

      <div
        id="inner-voice-log"
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          paddingRight: "4px",
          maxHeight: "500px",
        }}
      >
        {logs.length === 0 ? (
          <div style={{
            textAlign: "center",
            color: "var(--muted)",
            fontSize: "13px",
            padding: "40px 20px",
            lineHeight: "1.6",
          }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>💭</div>
            Haritadan bir aktivite seç...<br />
            <span style={{ fontSize: "11px", opacity: 0.6 }}>Ajanlar uyanacak</span>
          </div>
        ) : (
          logs.map((log) => {
            const style = AGENT_STYLES[log.agent] || AGENT_STYLES.System;
            return (
              <div
                key={log.id}
                className="log-entry"
                style={{
                  background: style.bg,
                  border: `1px solid ${style.color}30`,
                  borderRadius: "10px",
                  padding: "10px 12px",
                  animation: "fadeInDown 0.3s ease-out",
                }}
              >
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "4px",
                }}>
                  <span style={{
                    fontSize: "10px",
                    fontWeight: "700",
                    color: style.color,
                    background: style.bg,
                    border: `1px solid ${style.color}50`,
                    borderRadius: "4px",
                    padding: "1px 6px",
                    letterSpacing: "1px",
                  }}>
                    {style.label}
                  </span>
                  <span style={{
                    fontSize: "10px",
                    color: "var(--muted)",
                    marginLeft: "auto",
                  }}>
                    {log.timestamp.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </span>
                </div>
                <div style={{
                  fontSize: "12px",
                  color: "var(--text)",
                  lineHeight: "1.5",
                  wordBreak: "break-word",
                }}>
                  {log.message}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Token harcaması özet */}
      <div style={{
        marginTop: "12px",
        padding: "8px 12px",
        background: "rgba(255,255,255,0.03)",
        borderRadius: "8px",
        border: "1px solid rgba(255,255,255,0.05)",
        fontSize: "11px",
        color: "var(--muted)",
        display: "flex",
        justifyContent: "space-between",
      }}>
        <span>📡 {logs.length} log kaydı</span>
        <span>Canlı izleme aktif</span>
      </div>
    </div>
  );
}

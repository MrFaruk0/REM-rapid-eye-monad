import { useEffect, useRef } from "react";

const AGENT_CONFIG = {
  System: { name: "Sistem", color: "#64748b", icon: "⚙️" },
  TX:     { name: "Monad",  color: "#10b981", icon: "⛓️" },
  Logic:  { name: "Logic",  color: "#2563eb", icon: "🧠" },
  Memory: { name: "Memory", color: "#8b5cf6", icon: "💾" },
  Dream:  { name: "Dream",  color: "#ea580c", icon: "🌙" },
};

export default function AgentChat({ logs }) {
  const containerRef = useRef(null);

  // En altta kalması için
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  // Yeni loglar alttan eklendiği için ters çevirip render ederiz (eğer useBrain'de unshift yapıyorsan, listeyi ters çevirmeliyiz)
  const chatLogs = [...logs].reverse();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: "360px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <h3 style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", letterSpacing: "2px", textTransform: "uppercase", margin: 0 }}>
          Neural Network Chat
        </h3>
        <div style={{ display: "flex", gap: "8px" }}>
          {["Logic", "Memory", "Dream"].map(a => (
            <div key={a} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", color: AGENT_CONFIG[a].color }}>
              <span>{AGENT_CONFIG[a].icon}</span>
              <span style={{ fontWeight: "600" }}>{a}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        ref={containerRef}
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          paddingRight: "8px",
        }}
      >
        {chatLogs.length === 0 && (
          <div style={{ margin: "auto", color: "#3d4460", fontSize: "12px", fontStyle: "italic", textAlign: "center" }}>
            Ajanlar beklemede... Bir aktivite seçin.
          </div>
        )}

        {chatLogs.map((log) => {
          const config = AGENT_CONFIG[log.agent] || AGENT_CONFIG.System;
          const isSystem = log.agent === "System" || log.agent === "TX";
          
          if (isSystem) {
            return (
              <div key={log.id} style={{ display: "flex", justifyContent: "center", animation: "fadeInDown 0.3s ease-out" }}>
                <div style={{
                  background: `${config.color}15`,
                  border: `1px solid ${config.color}30`,
                  padding: "6px 12px", borderRadius: "12px",
                  fontSize: "11px", color: config.color, fontWeight: "600",
                }}>
                  {log.message}
                </div>
              </div>
            );
          }

          // Ajan Mesajı
          return (
            <div key={log.id} style={{
              display: "flex", gap: "10px",
              animation: "fadeInDown 0.3s ease-out",
            }}>
              {/* Avatar */}
              <div style={{
                width: "28px", height: "28px", borderRadius: "8px",
                background: `${config.color}20`, border: `1px solid ${config.color}40`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "14px", flexShrink: 0,
              }}>
                {config.icon}
              </div>

              {/* Baloncuk */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "10px", color: config.color, fontWeight: "700", marginBottom: "4px" }}>
                  {config.name}
                </div>
                <div style={{
                  background: "#131325", border: "1px solid #1a1d2e",
                  padding: "10px 14px", borderRadius: "0 12px 12px 12px",
                  fontSize: "13px", color: "#e2e8f0", lineHeight: "1.5",
                  position: "relative",
                }}>
                  {log.message}
                  
                  {/* Ek Veri (Varsa) */}
                  {log.data && (
                    <div style={{
                      marginTop: "8px", paddingTop: "8px", borderTop: "1px dashed #1a1d2e",
                      fontSize: "10px", color: "#64748b", display: "flex", gap: "8px", flexWrap: "wrap"
                    }}>
                      {log.data.event && <span style={{ color: log.data.event.type === 'good' ? '#10b981' : log.data.event.type === 'bad' ? '#ef4444' : '#8b5cf6' }}>⚡ Olay: {log.data.event.type}</span>}
                      {log.data.score && <span>📊 Skor: {log.data.score}</span>}
                      {log.data.tone && <span>🎭 Ton: {log.data.tone}</span>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

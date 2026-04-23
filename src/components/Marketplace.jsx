import { MARKETPLACE_ITEMS } from "../utils/sleepSystem";

export default function Marketplace({ onClose, onBuy }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 300,
      background: "rgba(8,8,15,0.8)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        background: "#0e0e1c",
        border: "1px solid rgba(109,40,217,0.3)",
        borderRadius: "24px",
        width: "90%", maxWidth: "600px",
        padding: "32px",
        position: "relative",
        boxShadow: "0 24px 80px rgba(0,0,0,0.8)",
        animation: "fadeInDown 0.3s ease-out",
      }}>
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "20px", right: "20px",
            background: "none", border: "none", color: "#64748b",
            fontSize: "20px", cursor: "pointer",
          }}
        >✕</button>

        <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#f8f8ff", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
          <span>🛒</span> Uyku Marketi
        </h2>
        <p style={{ fontSize: "13px", color: "#8891a8", marginBottom: "24px" }}>
          Uyku kaliteni artırmak için eşyalar satın al. Yüksek kalite, Legendary (NFT) rüya şansını artırır!
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {MARKETPLACE_ITEMS.map((item) => (
            <div key={item.id} style={{
              background: "#131325", border: "1px solid #1a1d2e",
              borderRadius: "16px", padding: "16px",
              display: "flex", flexDirection: "column", gap: "12px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ fontSize: "32px", background: "rgba(255,255,255,0.05)", width: "48px", height: "48px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: "#f0f0f8" }}>{item.name}</div>
                  <div style={{ fontSize: "11px", color: "#10b981", fontWeight: "600" }}>+{item.effect} Uyku Kalitesi</div>
                </div>
              </div>
              
              <div style={{ fontSize: "11px", color: "#64748b", flex: 1 }}>{item.desc}</div>

              <button
                onClick={async () => {
                  const success = await onBuy(item);
                  if (success) onClose();
                }}
                style={{
                  width: "100%", padding: "10px",
                  background: "rgba(109,40,217,0.15)", border: "1px solid rgba(109,40,217,0.3)",
                  borderRadius: "10px", color: "#a5b4fc", fontSize: "12px", fontWeight: "700",
                  cursor: "pointer", transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(109,40,217,0.25)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(109,40,217,0.15)"; }}
              >
                {item.price} MON
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";

const LOCATIONS = [
  {
    id: "park", name: "Doğa Parkı", icon: "🌳", color: "#16a34a",
    x: 25, y: 35,
    activities: [
      { id: "run", name: "Koşmak", icon: "🏃", desc: "Enerji at" },
      { id: "meditate", name: "Meditasyon yapmak", icon: "🧘", desc: "Zihni boşalt" },
      { id: "read", name: "Kitap okumak", icon: "📖", desc: "Odaklan" }
    ],
  },
  {
    id: "home", name: "Ev Alanı", icon: "🏠", color: "#7c3aed",
    x: 50, y: 55,
    activities: [
      { id: "nap", name: "Uyuklamak", icon: "😴", desc: "Uyku kalitesini artır" },
      { id: "cook", name: "Yemek yapmak", icon: "🍳", desc: "Yaratıcılık" },
      { id: "music", name: "Müzik dinlemek", icon: "🎵", desc: "Rahatla" }
    ],
  },
  {
    id: "beach", name: "Sahil", icon: "🏖️", color: "#0ea5e9",
    x: 75, y: 75,
    activities: [
      { id: "swim", name: "Yüzmek", icon: "🏊", desc: "Sulara dal" },
      { id: "sand", name: "Kumda oynamak", icon: "⛱️", desc: "Stres at" },
      { id: "surf", name: "Sörf yapmak", icon: "🏄", desc: "Heyecan" }
    ],
  },
];

function LocationPin({ loc, onSelect, isLocked }) {
  const [hovered, setHovered] = useState(false);
  const flipLeft = loc.x > 60;

  return (
    <div
      style={{
        position: "absolute",
        left: `${loc.x}%`,
        top: `${loc.y}%`,
        transform: "translate(-50%, -50%)",
        zIndex: hovered ? 20 : 2,
      }}
      onMouseEnter={() => !isLocked && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {!isLocked && (
        <div style={{
          position: "absolute", inset: "-15px", borderRadius: "50%",
          border: `2px solid ${loc.color}55`, animation: "pinPulse 3s ease-out infinite",
        }} />
      )}

      {/* Pin Base */}
      <div style={{
        width: "56px", height: "56px", borderRadius: "50%",
        background: `linear-gradient(135deg, ${loc.color}40, ${loc.color}10)`,
        border: `2px solid ${hovered ? loc.color : loc.color + "60"}`,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px",
        cursor: isLocked ? "not-allowed" : "pointer",
        transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        backdropFilter: "blur(12px)",
        boxShadow: hovered ? `0 10px 30px ${loc.color}60, inset 0 0 15px ${loc.color}40` : `0 4px 12px rgba(0,0,0,0.5)`,
        transform: hovered ? "scale(1.15) translateY(-5px)" : "scale(1) translateY(0)",
      }}>
        <div style={{
          position: "absolute", bottom: "-4px", width: "30px", height: "8px",
          background: "rgba(0,0,0,0.4)", borderRadius: "50%", filter: "blur(4px)", zIndex: -1
        }} />
        <span style={{ transform: hovered ? "scale(1.1)" : "scale(1)", transition: "transform 0.2s" }}>{loc.icon}</span>
      </div>

      <div style={{
        position: "absolute", top: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)",
        whiteSpace: "nowrap", fontSize: "11px", fontWeight: "800", color: hovered ? "#fff" : `${loc.color}dd`,
        letterSpacing: "1px", textTransform: "uppercase", textShadow: "0 2px 4px rgba(0,0,0,0.8)",
        transition: "color 0.2s", fontFamily: "'JetBrains Mono', monospace",
        background: "rgba(0,0,0,0.6)", padding: "2px 8px", borderRadius: "6px"
      }}>
        {loc.name}
      </div>

      {hovered && (
        <div style={{
          position: "absolute", top: "50%",
          ...(flipLeft ? { right: "calc(100% + 20px)" } : { left: "calc(100% + 20px)" }),
          transform: "translateY(-50%)",
          background: "rgba(14, 14, 28, 0.95)", backdropFilter: "blur(16px)",
          border: `1px solid ${loc.color}50`, borderRadius: "16px", padding: "16px", minWidth: "200px",
          animation: "fadeIn 0.15s ease-out", boxShadow: `0 20px 50px rgba(0,0,0,0.8), 0 0 0 1px ${loc.color}20`,
          pointerEvents: "all",
        }}>
          <div style={{
            fontSize: "10px", color: "#94a3b8", marginBottom: "12px",
            letterSpacing: "2px", textTransform: "uppercase", fontWeight: "800",
            display: "flex", alignItems: "center", gap: "8px", borderBottom: `1px solid ${loc.color}30`, paddingBottom: "8px"
          }}>
            <span style={{ color: loc.color }}>{loc.icon}</span> {loc.name}
          </div>

          {loc.activities.map((act, i) => (
            <button
              key={act.id}
              onClick={() => { onSelect(loc.name, act.name); setHovered(false); }}
              style={{
                display: "flex", alignItems: "flex-start", gap: "12px", width: "100%", padding: "10px",
                background: `${loc.color}10`, border: `1px solid ${loc.color}20`, borderRadius: "12px",
                color: "#e2e8f0", cursor: "pointer", marginBottom: i < loc.activities.length - 1 ? "8px" : 0,
                textAlign: "left", transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = `${loc.color}25`; e.currentTarget.style.borderColor = `${loc.color}60`; e.currentTarget.style.transform = "translateX(4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = `${loc.color}10`; e.currentTarget.style.borderColor = `${loc.color}20`; e.currentTarget.style.transform = "translateX(0)"; }}
            >
              <span style={{ fontSize: "20px", lineHeight: 1 }}>{act.icon}</span>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#fff" }}>{act.name}</div>
                <div style={{ fontSize: "10px", color: "#94a3b8", marginTop: "2px" }}>{act.desc}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MapGrid({ onActivitySelect, isProcessing, isNight, tokenLimitReached }) {
  const isLocked = isProcessing || isNight || tokenLimitReached;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <h3 style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", letterSpacing: "2px", textTransform: "uppercase", margin: 0 }}>
          Zihin Haritası
        </h3>
        {isLocked && (
          <span style={{ fontSize: "11px", color: isNight ? "#f97316" : "#64748b", fontWeight: "700", background: "rgba(0,0,0,0.3)", padding: "4px 10px", borderRadius: "10px" }}>
            {isNight ? "🌙 Uyku Evresi" : isProcessing ? "⚡ İşleniyor..." : "🔒 Yorgun"}
          </span>
        )}
      </div>

      <div style={{
        position: "relative", flex: 1, minHeight: "320px", borderRadius: "20px",
        background: "linear-gradient(to bottom, #0f172a, #020617)",
        border: "1px solid #1e293b", overflow: "visible", boxShadow: "inset 0 0 60px rgba(0,0,0,0.8)",
      }}>
        {/* Isometric SVG Background */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", borderRadius: "20px" }} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 40 10 L 20 20 L 0 10 Z" fill="none" stroke="#1e293b" strokeWidth="0.5" />
            </pattern>
            <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#16a34a" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#15803d" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="city" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#5b21b6" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Iso Grid */}
          <rect width="100%" height="100%" fill="url(#grid)" opacity="0.3" />

          {/* Park Zone */}
          <path d="M 0 150 L 300 0 L 450 100 L 150 250 Z" fill="url(#grass)" />
          
          {/* Home Zone */}
          <path d="M 200 300 L 500 150 L 800 300 L 500 450 Z" fill="url(#city)" />
          
          {/* Beach Zone */}
          <path d="M 400 500 L 700 350 L 800 400 L 800 600 L 500 600 Z" fill="url(#water)" />

          {/* Paths connecting zones */}
          <path d="M 225 125 Q 350 200 350 300 T 600 450" fill="none" stroke="#334155" strokeWidth="4" strokeDasharray="10 10" opacity="0.6" />
        </svg>

        {LOCATIONS.map((loc) => (
          <LocationPin key={loc.id} loc={loc} onSelect={onActivitySelect} isLocked={isLocked} />
        ))}

        {isLocked && (
          <div style={{
            position: "absolute", inset: 0, borderRadius: "20px",
            background: "rgba(2,6,23,0.6)", backdropFilter: "blur(2px)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10
          }}>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: "16px", marginTop: "16px", flexWrap: "wrap" }}>
        {LOCATIONS.map((loc) => (
          <div key={loc.id} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "#94a3b8", fontWeight: "600" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "3px", background: loc.color, boxShadow: `0 0 10px ${loc.color}80` }} />
            {loc.name}
          </div>
        ))}
        <div style={{ marginLeft: "auto", fontSize: "10px", color: "#475569", fontStyle: "italic", background: "#0f172a", padding: "4px 8px", borderRadius: "6px" }}>
          Pin üzerine gel → aktivite seç
        </div>
      </div>
    </div>
  );
}

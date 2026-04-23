import { useState } from "react";

const LOCATIONS = [
  {
    id: "park", name: "Park", icon: "🌳", color: "#16a34a",
    // Harita üzerindeki konum (%)
    x: 22, y: 40,
    terrain: "green",
    activities: [
      { id: "run", name: "Koşmak", icon: "🏃", desc: "Enerjiyi serbest bırak" },
      { id: "read", name: "Kitap okumak", icon: "📖", desc: "Zihin açılsın" },
    ],
  },
  {
    id: "home", name: "Ev", icon: "🏠", color: "#7c3aed",
    x: 50, y: 22,
    terrain: "urban",
    activities: [
      { id: "music", name: "Müzik dinlemek", icon: "🎵", desc: "Ruhu besle" },
      { id: "nap", name: "Uyuklamak", icon: "😴", desc: "Yenilen" },
    ],
  },
  {
    id: "beach", name: "Su Kıyısı", icon: "🏖️", color: "#0284c7",
    x: 76, y: 62,
    terrain: "water",
    activities: [
      { id: "swim", name: "Yüzmek", icon: "🏊", desc: "Dalgalarla bütünleş" },
      { id: "sand", name: "Kumda oynamak", icon: "⛱️", desc: "Sakin bir an" },
    ],
  },
];

function LocationPin({ loc, onSelect, isLocked }) {
  const [hovered, setHovered] = useState(false);
  // Tooltip konumu: sağa mı sola mı açılacak
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
      {/* Pulse ring */}
      {!isLocked && (
        <div style={{
          position: "absolute",
          inset: "-10px",
          borderRadius: "50%",
          border: `1px solid ${loc.color}55`,
          animation: "pinPulse 2.5s ease-out infinite",
        }} />
      )}

      {/* Ana pin */}
      <div style={{
        width: "46px", height: "46px",
        borderRadius: "50%",
        background: hovered ? `${loc.color}30` : `${loc.color}18`,
        border: `2px solid ${hovered ? loc.color : loc.color + "60"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "20px",
        cursor: isLocked ? "not-allowed" : "pointer",
        transition: "all 0.18s ease",
        backdropFilter: "blur(8px)",
        boxShadow: hovered ? `0 0 24px ${loc.color}50` : "none",
        transform: hovered ? "scale(1.1)" : "scale(1)",
      }}>
        {loc.icon}
      </div>

      {/* Etiket */}
      <div style={{
        position: "absolute",
        top: "calc(100% + 6px)",
        left: "50%",
        transform: "translateX(-50%)",
        whiteSpace: "nowrap",
        fontSize: "10px",
        fontWeight: "700",
        color: hovered ? loc.color : `${loc.color}99`,
        letterSpacing: "0.5px",
        textTransform: "uppercase",
        transition: "color 0.18s",
        fontFamily: "'Inter', sans-serif",
      }}>
        {loc.name}
      </div>

      {/* Hover tooltip */}
      {hovered && (
        <div style={{
          position: "absolute",
          top: "50%",
          ...(flipLeft
            ? { right: "calc(100% + 16px)" }
            : { left: "calc(100% + 16px)" }),
          transform: "translateY(-50%)",
          background: "#0e0e1c",
          border: `1px solid ${loc.color}35`,
          borderRadius: "14px",
          padding: "14px",
          minWidth: "170px",
          animation: "fadeIn 0.12s ease-out",
          boxShadow: `0 12px 40px rgba(0,0,0,0.7), 0 0 0 1px ${loc.color}15`,
          pointerEvents: "all",
        }}>
          {/* Tooltip ok */}
          <div style={{
            position: "absolute",
            top: "50%",
            ...(flipLeft
              ? { right: "-6px", borderLeft: `6px solid ${loc.color}35`, borderRight: "none" }
              : { left: "-6px", borderRight: `6px solid ${loc.color}35`, borderLeft: "none" }),
            transform: "translateY(-50%)",
            width: 0, height: 0,
            borderTop: "6px solid transparent",
            borderBottom: "6px solid transparent",
          }} />

          <div style={{
            fontSize: "10px", color: "#64748b",
            marginBottom: "10px",
            letterSpacing: "1.5px", textTransform: "uppercase",
            fontWeight: "700",
            display: "flex", alignItems: "center", gap: "6px",
          }}>
            <span style={{ color: loc.color }}>{loc.icon}</span>
            {loc.name}
          </div>

          {loc.activities.map((act, i) => (
            <button
              key={act.id}
              id={`activity-${act.id}`}
              onClick={() => { onSelect(loc.name, act.name); setHovered(false); }}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                width: "100%",
                padding: "10px",
                background: `${loc.color}10`,
                border: `1px solid ${loc.color}25`,
                borderRadius: "10px",
                color: "#e2e8f0",
                cursor: "pointer",
                marginBottom: i < loc.activities.length - 1 ? "6px" : 0,
                textAlign: "left",
                transition: "all 0.15s",
                fontFamily: "'Inter', sans-serif",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = `${loc.color}22`;
                e.currentTarget.style.borderColor = `${loc.color}55`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = `${loc.color}10`;
                e.currentTarget.style.borderColor = `${loc.color}25`;
              }}
            >
              <span style={{ fontSize: "18px", lineHeight: 1 }}>{act.icon}</span>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "#f0f0f8" }}>
                  {act.name}
                </div>
                <div style={{ fontSize: "10px", color: "#64748b", marginTop: "1px" }}>
                  {act.desc}
                </div>
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
    <div>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: "14px",
      }}>
        <h3 style={{
          fontSize: "11px", fontWeight: "700",
          color: "#64748b", letterSpacing: "2px", textTransform: "uppercase", margin: 0,
        }}>
          Dünya Haritası
        </h3>
        {isLocked && (
          <span style={{
            fontSize: "11px", color: isNight ? "#f97316" : "#64748b",
            fontWeight: "600",
          }}>
            {isNight ? "🌙 Rüya Modu" : isProcessing ? "⚡ İşleniyor..." : "🔒 Limit Doldu"}
          </span>
        )}
      </div>

      {/* Harita konteyneri */}
      <div style={{
        position: "relative",
        height: "280px",
        borderRadius: "16px",
        overflow: "visible", // tooltip taşabilmeli
        background: "#0b0d16",
        border: "1px solid #1a1d2e",
      }}>
        {/* SVG Terrain */}
        <svg
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", borderRadius: "16px" }}
          viewBox="0 0 400 280"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Nokta grid */}
          <defs>
            <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.8" fill="#1e2240" />
            </pattern>
            {/* Park bölgesi */}
            <radialGradient id="parkGrad" cx="22%" cy="40%" r="30%">
              <stop offset="0%" stopColor="#16a34a" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
            </radialGradient>
            {/* Ev bölgesi */}
            <radialGradient id="homeGrad" cx="50%" cy="22%" r="25%">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
            </radialGradient>
            {/* Sahil bölgesi */}
            <radialGradient id="beachGrad" cx="76%" cy="62%" r="30%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Arka plan grid */}
          <rect width="400" height="280" fill="url(#dots)" />

          {/* Terrain renk bölgeleri */}
          <rect width="400" height="280" fill="url(#parkGrad)" />
          <rect width="400" height="280" fill="url(#homeGrad)" />
          <rect width="400" height="280" fill="url(#beachGrad)" />

          {/* Su çizgisi — sahil kıyısı */}
          <path
            d="M 260 200 Q 300 180 340 210 Q 370 230 400 220 L 400 280 L 260 280 Z"
            fill="#0284c720"
          />
          <path
            d="M 270 200 Q 310 182 350 212 Q 375 228 400 218"
            fill="none" stroke="#0284c740" strokeWidth="1.5"
          />

          {/* Yollar — konumları birbirine bağlayan ince çizgiler */}
          <path
            d="M 88 112 L 200 62 L 304 174"
            fill="none" stroke="#1e2240" strokeWidth="2.5" strokeDasharray="6 4"
          />

          {/* Park ağaç sembolleri */}
          {[[55,95],[70,120],[45,130],[80,100]].map(([x,y],i) => (
            <g key={i} transform={`translate(${x},${y})`} opacity="0.25">
              <circle cx="0" cy="0" r="8" fill="#16a34a" />
              <rect x="-1.5" y="0" width="3" height="6" fill="#15803d" />
            </g>
          ))}

          {/* Ev çatısı sembolü */}
          <g transform="translate(195,40)" opacity="0.2">
            <rect x="-10" y="4" width="20" height="14" fill="#7c3aed" />
            <polygon points="0,-6 -14,4 14,4" fill="#5b21b6" />
          </g>
        </svg>

        {/* Location pin'leri */}
        {LOCATIONS.map((loc) => (
          <LocationPin
            key={loc.id}
            loc={loc}
            onSelect={onActivitySelect}
            isLocked={isLocked}
          />
        ))}

        {/* Kilitleme overlay */}
        {isLocked && (
          <div style={{
            position: "absolute", inset: 0,
            borderRadius: "16px",
            background: "rgba(8,8,15,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(1px)",
          }}>
            <div style={{
              fontSize: "13px", fontWeight: "600",
              color: isNight ? "#f97316" : "#64748b",
              background: "#0e0e1c",
              padding: "10px 20px",
              borderRadius: "20px",
              border: `1px solid ${isNight ? "rgba(249,115,22,0.3)" : "rgba(255,255,255,0.08)"}`,
            }}>
              {isNight ? "🌙 Rüya devam ediyor..." : isProcessing ? "⚡ İşleniyor..." : "🔒 Token limiti doldu"}
            </div>
          </div>
        )}
      </div>

      {/* Lokasyon legend */}
      <div style={{
        display: "flex", gap: "12px", marginTop: "12px", flexWrap: "wrap",
      }}>
        {LOCATIONS.map((loc) => (
          <div key={loc.id} style={{
            display: "flex", alignItems: "center", gap: "5px",
            fontSize: "11px", color: "#64748b",
          }}>
            <div style={{
              width: "8px", height: "8px", borderRadius: "50%",
              background: loc.color, opacity: 0.7,
            }} />
            {loc.name}
          </div>
        ))}
        <div style={{
          marginLeft: "auto", fontSize: "10px", color: "#3d4460",
          fontStyle: "italic",
        }}>
          Üzerine gel → aktiviteyi seç
        </div>
      </div>
    </div>
  );
}

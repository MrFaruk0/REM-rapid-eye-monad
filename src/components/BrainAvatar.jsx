// BrainAvatar — Nefes alan SVG beyin karakteri
export default function BrainAvatar({ isNight, isProcessing }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "8px",
    }}>
      <div style={{
        width: "120px",
        height: "120px",
        position: "relative",
        animation: isProcessing
          ? "pulse 0.5s ease-in-out infinite"
          : "breathe 3s ease-in-out infinite",
      }}>
        {/* Glow ring */}
        <div style={{
          position: "absolute",
          inset: "-8px",
          borderRadius: "50%",
          background: isNight
            ? "radial-gradient(circle, rgba(249,115,22,0.3) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)",
          animation: "glow 2s ease-in-out infinite",
        }} />

        {/* SVG Brain */}
        <svg
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "100%", filter: "drop-shadow(0 0 12px rgba(124,58,237,0.8))" }}
        >
          {/* Defs */}
          <defs>
            <radialGradient id="brainGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={isNight ? "#f97316" : "#a78bfa"} />
              <stop offset="100%" stopColor={isNight ? "#7c2d12" : "#4c1d95"} />
            </radialGradient>
            <radialGradient id="brainGrad2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={isNight ? "#fb923c" : "#8b5cf6"} />
              <stop offset="100%" stopColor={isNight ? "#9a3412" : "#3730a3"} />
            </radialGradient>
          </defs>

          {/* Sol hemisfer */}
          <ellipse cx="35" cy="52" rx="28" ry="34" fill="url(#brainGrad)" />
          {/* Sağ hemisfer */}
          <ellipse cx="65" cy="52" rx="28" ry="34" fill="url(#brainGrad2)" />
          {/* Orta çizgi */}
          <line x1="50" y1="20" x2="50" y2="84" stroke="rgba(0,0,0,0.3)" strokeWidth="2" />
          {/* Kıvrımlar sol */}
          <path d="M 20 45 Q 30 35 25 55" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeLinecap="round"/>
          <path d="M 15 60 Q 28 50 22 68" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeLinecap="round"/>
          <path d="M 25 35 Q 38 28 32 42" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round"/>
          {/* Kıvrımlar sağ */}
          <path d="M 80 45 Q 70 35 75 55" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeLinecap="round"/>
          <path d="M 85 60 Q 72 50 78 68" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeLinecap="round"/>
          <path d="M 75 35 Q 62 28 68 42" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round"/>
          {/* Parıltı noktaları - aktif nöronlar */}
          {isProcessing && (
            <>
              <circle cx="30" cy="45" r="2" fill="#fff" opacity="0.9">
                <animate attributeName="opacity" values="0.9;0.1;0.9" dur="0.4s" repeatCount="indefinite"/>
              </circle>
              <circle cx="70" cy="40" r="2" fill="#fff" opacity="0.9">
                <animate attributeName="opacity" values="0.1;0.9;0.1" dur="0.3s" repeatCount="indefinite"/>
              </circle>
              <circle cx="50" cy="55" r="2" fill="#fff" opacity="0.9">
                <animate attributeName="opacity" values="0.9;0.1;0.9" dur="0.5s" repeatCount="indefinite"/>
              </circle>
            </>
          )}
        </svg>
      </div>

      <span style={{
        fontSize: "11px",
        color: isNight ? "var(--orange)" : "var(--purple-light)",
        fontWeight: "600",
        letterSpacing: "2px",
        textTransform: "uppercase",
      }}>
        {isNight ? "🌙 Rüya Modu" : isProcessing ? "⚡ İşleniyor" : "🧠 Aktif"}
      </span>
    </div>
  );
}

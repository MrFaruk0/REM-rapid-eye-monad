// TokenBar — günlük token limiti progress bar
export default function TokenBar({ tokenTotal, limit = 500 }) {
  const percent = Math.min((tokenTotal / limit) * 100, 100);
  const isWarning = percent >= 70;
  const isDanger = percent >= 90;
  const isFull = percent >= 100;

  const barColor = isFull
    ? "#ef4444"
    : isDanger
    ? "#f97316"
    : isWarning
    ? "#eab308"
    : "#7c3aed";

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      minWidth: "200px",
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <span style={{
          fontSize: "11px",
          color: "var(--muted)",
          fontWeight: "600",
          letterSpacing: "1px",
          textTransform: "uppercase",
        }}>
          ⚡ Token
        </span>
        <span style={{
          fontSize: "11px",
          fontWeight: "700",
          color: isFull ? "#ef4444" : isWarning ? "#eab308" : "var(--text)",
          fontFamily: "monospace",
        }}>
          {tokenTotal} / {limit}
        </span>
      </div>

      {/* Progress track */}
      <div style={{
        height: "8px",
        background: "rgba(255,255,255,0.06)",
        borderRadius: "4px",
        overflow: "hidden",
        position: "relative",
      }}>
        <div
          id="token-progress-bar"
          style={{
            height: "100%",
            width: `${percent}%`,
            background: isFull
              ? "linear-gradient(90deg, #ef4444, #dc2626)"
              : `linear-gradient(90deg, ${barColor}, ${barColor}cc)`,
            borderRadius: "4px",
            transition: "width 0.4s ease, background 0.4s ease",
            boxShadow: `0 0 8px ${barColor}80`,
          }}
        />
        {/* Shimmer efekti */}
        {!isFull && (
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
            animation: "shimmer 2s infinite",
          }} />
        )}
      </div>

      {isFull && (
        <div style={{
          fontSize: "11px",
          color: "#ef4444",
          fontWeight: "700",
          textAlign: "center",
          animation: "pulse 1s ease-in-out infinite",
        }}>
          🌙 GECE BAŞLIYOR
        </div>
      )}
    </div>
  );
}

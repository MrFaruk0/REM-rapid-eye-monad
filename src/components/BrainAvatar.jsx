import brainMorning from "../assets/brain_moring.png";
import brainNight from "../assets/brain_night.png";

// BrainAvatar — Nefes alan beyin karakteri
export default function BrainAvatar({ isNight, isProcessing }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "8px",
    }}>
      <div style={{
        width: "160px",
        height: "160px",
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

        {/* Brain Image */}
        <img
          src={isNight ? brainNight : brainMorning}
          alt="Brain Avatar"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            position: "relative",
            zIndex: 1,
            filter: isNight ? "drop-shadow(0 0 12px rgba(249,115,22,0.5))" : "drop-shadow(0 0 12px rgba(124,58,237,0.5))"
          }}
        />
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

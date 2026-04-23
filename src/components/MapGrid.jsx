// MapGrid — 3 lokasyon, 6 aktivite
const LOCATIONS = [
  {
    id: "beach",
    icon: "🏖️",
    name: "Su Kıyısı",
    color: "#0ea5e9",
    activities: [
      { id: "swim", name: "Yüzmek", icon: "🏊", desc: "Dalgalarla bütünleş" },
      { id: "sand", name: "Kumda oynamak", icon: "⛱️", desc: "Sakin bir an" },
    ],
  },
  {
    id: "park",
    icon: "🌳",
    name: "Park",
    color: "#22c55e",
    activities: [
      { id: "run", name: "Koşmak", icon: "🏃", desc: "Enerjiyi serbest bırak" },
      { id: "read", name: "Kitap okumak", icon: "📖", desc: "Zihin açılsın" },
    ],
  },
  {
    id: "home",
    icon: "🏠",
    name: "Ev",
    color: "#a78bfa",
    activities: [
      { id: "music", name: "Müzik dinlemek", icon: "🎵", desc: "Ruhu besle" },
      { id: "nap", name: "Uyuklamak", icon: "😴", desc: "Dinlen ve yenilen" },
    ],
  },
];

export default function MapGrid({ onActivitySelect, isProcessing, isNight, tokenLimitReached }) {
  const isLocked = isProcessing || isNight || tokenLimitReached;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <h3 style={{
        fontSize: "12px",
        fontWeight: "700",
        color: "var(--muted)",
        letterSpacing: "2px",
        textTransform: "uppercase",
        margin: 0,
      }}>
        🗺️ Dünya Haritası
      </h3>

      {LOCATIONS.map((loc) => (
        <div key={loc.id} style={{
          background: "var(--surface)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "16px",
          padding: "16px",
          transition: "border-color 0.2s",
        }}>
          {/* Lokasyon başlığı */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "12px",
          }}>
            <span style={{ fontSize: "20px" }}>{loc.icon}</span>
            <span style={{
              fontSize: "14px",
              fontWeight: "700",
              color: loc.color,
            }}>{loc.name}</span>
            <div style={{
              flex: 1,
              height: "1px",
              background: `linear-gradient(to right, ${loc.color}40, transparent)`,
            }} />
          </div>

          {/* Aktiviteler */}
          <div style={{ display: "flex", gap: "8px" }}>
            {loc.activities.map((act) => (
              <button
                key={act.id}
                id={`activity-${act.id}`}
                onClick={() => !isLocked && onActivitySelect(loc.name, act.name)}
                disabled={isLocked}
                style={{
                  flex: 1,
                  padding: "12px 10px",
                  background: isLocked
                    ? "rgba(255,255,255,0.03)"
                    : `linear-gradient(135deg, ${loc.color}15, ${loc.color}05)`,
                  border: `1px solid ${isLocked ? "rgba(255,255,255,0.05)" : loc.color + "40"}`,
                  borderRadius: "12px",
                  cursor: isLocked ? "not-allowed" : "pointer",
                  color: isLocked ? "var(--muted)" : "var(--text)",
                  transition: "all 0.2s",
                  textAlign: "left",
                  opacity: isLocked ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isLocked) {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${loc.color}25, ${loc.color}10)`;
                    e.currentTarget.style.borderColor = loc.color + "80";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = `0 4px 20px ${loc.color}25`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLocked) {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${loc.color}15, ${loc.color}05)`;
                    e.currentTarget.style.borderColor = loc.color + "40";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
              >
                <div style={{ fontSize: "18px", marginBottom: "4px" }}>{act.icon}</div>
                <div style={{ fontSize: "13px", fontWeight: "600" }}>{act.name}</div>
                <div style={{ fontSize: "10px", color: "var(--muted)", marginTop: "2px" }}>{act.desc}</div>
              </button>
            ))}
          </div>
        </div>
      ))}

      {tokenLimitReached && (
        <div style={{
          textAlign: "center",
          padding: "12px",
          background: "rgba(249,115,22,0.1)",
          border: "1px solid rgba(249,115,22,0.3)",
          borderRadius: "12px",
          color: "var(--orange)",
          fontSize: "13px",
          fontWeight: "600",
        }}>
          🌙 Token limiti doldu — Rüya modu aktif
        </div>
      )}
    </div>
  );
}

import { useState } from "react";

export default function DreamHistory({ dreams, currentDream, onMintNft }) {
  const [selected, setSelected] = useState(null);

  const allDreams = dreams || [];

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <h3 style={{ fontSize: "12px", fontWeight: "700", color: "var(--muted)", letterSpacing: "2px", textTransform: "uppercase", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
          🌙 Rüya Arşivi
          <span style={{ background: "rgba(249,115,22,0.2)", color: "#f97316", borderRadius: "20px", padding: "2px 8px", fontSize: "10px", fontWeight: "700" }}>
            {allDreams.length} kayıt
          </span>
        </h3>
        {currentDream?.tier && (
          <div style={{ fontSize: "10px", fontWeight: "700", color: currentDream.tier.color, background: `${currentDream.tier.color}20`, padding: "4px 8px", borderRadius: "8px", border: `1px solid ${currentDream.tier.color}40` }}>
            {currentDream.tier.icon} {currentDream.tier.label}
          </div>
        )}
      </div>

      {/* Aktif rüya — büyük gösterim */}
      {currentDream && (
        <div style={{
          marginBottom: "20px",
          background: "linear-gradient(135deg, rgba(249,115,22,0.1), rgba(124,58,237,0.1))",
          border: "1px solid rgba(249,115,22,0.3)",
          borderRadius: "20px",
          overflow: "hidden",
          animation: "fadeIn 0.8s ease-out",
        }}>
          <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ background: "rgba(249,115,22,0.25)", color: "#f97316", fontSize: "10px", fontWeight: "800", letterSpacing: "2px", padding: "3px 10px", borderRadius: "4px" }}>
              🔴 CANLI
            </span>
            <span style={{ color: "var(--muted)", fontSize: "12px" }}>Bu gecenin rüyası</span>
            <span style={{ marginLeft: "auto", color: "var(--muted)", fontSize: "11px" }}>{currentDream.date}</span>
          </div>

          <div style={{ position: "relative" }}>
            <img
              src={currentDream.imageUrl}
              alt="Dream visualization"
              style={{ width: "100%", maxHeight: "400px", objectFit: "cover", display: "block" }}
              onLoad={(e) => { e.target.style.opacity = 1; }}
              onError={(e) => { e.target.style.display = "none"; }}
            />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 16px 16px", background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }}>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", fontStyle: "italic", lineHeight: "1.5" }}>
                "{currentDream.prompt?.slice(0, 120)}..."
              </div>
            </div>
          </div>

          {/* Görev durumu & NFT Butonu */}
          <div style={{
            padding: "16px", display: "flex", alignItems: "center", gap: "12px",
            borderTop: "1px solid rgba(255,255,255,0.05)", flexWrap: "wrap"
          }}>
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <span style={{ fontSize: "12px", color: "var(--muted)" }}>Görev: {currentDream.task}</span>
              <span style={{ fontSize: "11px", color: currentDream.taskCompleted ? "#22c55e" : "#f97316", fontWeight: "700", marginTop: "4px" }}>
                {currentDream.taskCompleted ? "✅ Görev Rüyada Tamamlandı" : "❌ Görev Başarısız"}
              </span>
            </div>
            
            {/* NFT Mint Butonu - Legendary tier */}
            {currentDream.tier?.nft && onMintNft && (
              <button
                onClick={() => onMintNft(currentDream)}
                style={{
                  padding: "10px 20px", background: "linear-gradient(135deg, #f59e0b, #d97706)",
                  border: "none", borderRadius: "12px", color: "#fff", fontSize: "12px", fontWeight: "800",
                  cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
                  boxShadow: "0 4px 16px rgba(245, 158, 11, 0.4)", transition: "all 0.2s"
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(245, 158, 11, 0.5)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(245, 158, 11, 0.4)"; }}
              >
                🏆 NFT Olarak Mintle
              </button>
            )}
          </div>
        </div>
      )}

      {/* Geçmiş rüyalar grid */}
      {allDreams.length === 0 && !currentDream ? (
        <div style={{ textAlign: "center", color: "var(--muted)", padding: "40px 20px", fontSize: "13px", background: "var(--surface)", borderRadius: "16px", border: "1px dashed rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px", opacity: 0.5 }}>🌙</div>
          Henüz rüya yok.<br />
          <span style={{ fontSize: "11px", opacity: 0.6 }}>Token limiti dolduktan sonra rüya başlar.</span>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px" }}>
          {allDreams.slice(0, 9).map((dream) => (
            <div
              key={dream.id}
              onClick={() => setSelected(selected?.id === dream.id ? null : dream)}
              style={{
                borderRadius: "14px", overflow: "hidden", cursor: "pointer",
                border: selected?.id === dream.id ? "2px solid #f97316" : "1px solid rgba(255,255,255,0.06)",
                transition: "all 0.2s", background: "var(--surface)", position: "relative"
              }}
            >
              {dream.tier?.nft && (
                <div style={{ position: "absolute", top: "8px", right: "8px", zIndex: 10, background: "rgba(0,0,0,0.6)", padding: "2px", borderRadius: "6px", fontSize: "14px" }}>
                  🏆
                </div>
              )}
              <div style={{ position: "relative", paddingBottom: "100%", background: "#1a1a2e" }}>
                <img src={dream.imageUrl} alt={`Dream ${dream.date}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
              </div>
              <div style={{ padding: "8px 10px" }}>
                <div style={{ fontSize: "10px", color: "var(--muted)" }}>{dream.date}</div>
                <div style={{ fontSize: "10px", color: dream.taskCompleted ? "#22c55e" : "var(--muted)", marginTop: "2px" }}>
                  {dream.taskCompleted ? "✅ Görev tamam" : "❌ Görev yarım"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Seçili rüya detayı */}
      {selected && (
        <div style={{ marginTop: "16px", padding: "16px", background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.25)", borderRadius: "14px", animation: "fadeIn 0.3s ease-out" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <div style={{ fontSize: "11px", color: "var(--muted)" }}>{selected.date} — {selected.task}</div>
            {selected.tier && (
              <div style={{ fontSize: "10px", color: selected.tier.color, fontWeight: "700" }}>{selected.tier.label} {selected.tier.icon}</div>
            )}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text)", fontStyle: "italic", lineHeight: "1.6" }}>"{selected.prompt}"</div>
          {selected.memorySummary && (
            <div style={{ marginTop: "8px", fontSize: "11px", color: "var(--muted)", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "8px" }}>
              <strong>Bellek özeti:</strong> {selected.memorySummary}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

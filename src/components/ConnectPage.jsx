// ConnectPage — MetaMask veya cüzdansız demo modu

export default function ConnectPage({ onConnect, onGuest, isConnecting, error }) {
  const hasMetaMask = typeof window !== "undefined" && Boolean(window.ethereum);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#08080f",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', sans-serif",
      padding: "24px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Arka plan grid */}
      <svg style={{
        position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04,
      }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#6d28d9" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Glow orb */}
      <div style={{
        position: "absolute",
        width: "600px", height: "600px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(109,40,217,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Card */}
      <div style={{
        position: "relative",
        maxWidth: "420px",
        width: "100%",
        background: "#0e0e1c",
        border: "1px solid rgba(109,40,217,0.25)",
        borderRadius: "24px",
        padding: "48px 40px",
        textAlign: "center",
        boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
      }}>
        {/* Logo */}
        <div style={{
          width: "72px", height: "72px",
          borderRadius: "20px",
          background: "linear-gradient(135deg, #6d28d9 0%, #4c1d95 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "36px",
          margin: "0 auto 24px",
          boxShadow: "0 8px 32px rgba(109,40,217,0.4)",
        }}>
          🧠
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: "28px", fontWeight: "800",
          color: "#f8f8ff", letterSpacing: "-0.5px",
          marginBottom: "8px",
        }}>
          Brain Agent
        </h1>
        <p style={{
          fontSize: "13px", color: "#8891a8",
          lineHeight: "1.6", marginBottom: "32px",
        }}>
          Yapay zeka destekli Monad Testnet deneyimi.<br />
          Oynamak için cüzdanını bağla.
        </p>

        {/* Divider */}
        <div style={{
          height: "1px", background: "rgba(255,255,255,0.06)",
          marginBottom: "24px",
        }} />

        {/* Connect button */}
        {hasMetaMask ? (
          <button
            id="connect-metamask-btn"
            onClick={onConnect}
            disabled={isConnecting}
            style={{
              width: "100%",
              padding: "14px 24px",
              background: isConnecting
                ? "rgba(109,40,217,0.4)"
                : "linear-gradient(135deg, #6d28d9, #5b21b6)",
              border: "none",
              borderRadius: "12px",
              color: "#fff",
              fontSize: "15px",
              fontWeight: "700",
              cursor: isConnecting ? "wait" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              transition: "all 0.2s",
              boxShadow: "0 4px 20px rgba(109,40,217,0.35)",
            }}
            onMouseEnter={e => { if (!isConnecting) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(109,40,217,0.5)"; }}}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(109,40,217,0.35)"; }}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
              alt="MetaMask"
              style={{ width: "22px", height: "22px" }}
            />
            {isConnecting ? "Bağlanıyor..." : "MetaMask ile Bağlan"}
          </button>
        ) : (
          <div>
            <div style={{
              padding: "14px", background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px",
              color: "#f87171", fontSize: "13px", marginBottom: "16px",
            }}>
              MetaMask bulunamadı. Lütfen tarayıcı eklentisini yükle.
            </div>
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noreferrer"
              style={{
                display: "block", padding: "14px",
                background: "transparent",
                border: "1px solid rgba(109,40,217,0.4)",
                borderRadius: "12px", color: "#a78bfa",
                fontSize: "14px", fontWeight: "600",
                textDecoration: "none",
                transition: "all 0.2s",
              }}
            >
              MetaMask İndir →
            </a>
          </div>
        )}

        {/* Error */}
        {error && (
          <p style={{
            marginTop: "16px", fontSize: "12px",
            color: "#f87171", lineHeight: "1.5",
          }}>
            ⚠️ {error}
          </p>
        )}

        {/* Demo modu */}
        <div style={{ marginTop: "20px", position: "relative", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
          <span style={{ fontSize: "11px", color: "#3d4460", whiteSpace: "nowrap" }}>ya da</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
        </div>
        <button
          id="guest-mode-btn"
          onClick={onGuest}
          style={{
            marginTop: "14px", width: "100%",
            padding: "11px 24px",
            background: "transparent",
            border: "1px solid #1a1d2e",
            borderRadius: "12px",
            color: "#64748b", fontSize: "13px", fontWeight: "500",
            cursor: "pointer", transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#2a2d40"; e.currentTarget.style.color = "#94a3b8"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#1a1d2e"; e.currentTarget.style.color = "#64748b"; }}
        >
          Demo Modunda Devam Et <span style={{ opacity: 0.5 }}>(TX yok)</span>
        </button>

        {/* Bilgi notu */}
        <p style={{
          marginTop: "20px", fontSize: "11px",
          color: "rgba(136,145,168,0.4)", lineHeight: "1.5",
        }}>
          Monad Testnet · Chain ID 10143<br />
          Her aktivite küçük bir test MON harcatır.
        </p>
      </div>

      {/* Alt logo */}
      <div style={{
        marginTop: "32px", fontSize: "11px",
        color: "rgba(136,145,168,0.4)", letterSpacing: "2px",
      }}>
        MONAD BLITZ HACKATHON
      </div>
    </div>
  );
}

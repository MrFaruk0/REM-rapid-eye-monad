# PROJECT_MEMORY.md
> Bu dosya her adımdan önce okunur, her adımdan sonra güncellenir.

---

## PROJE: Brain Agent
**Son güncelleme:** 2026-04-23 — v2.0 ✅

---

## STACK
- Vite + React (create-vite@9.0.6)
- ethers.js v6 — MetaMask, native MON transfer, contract YOK
- OpenRouter API — `mistralai/mistral-7b-instruct:free`
- Pollinations.ai — `https://pollinations.ai/p/{prompt}` (yeni endpoint)
- Inline CSS + saf CSS (Tailwind/MUI/Chakra YASAK)

---

## TAMAMLANAN ADIMLAR (v2)
- [x] Pollinations URL fix: `pollinations.ai/p/` kullanılıyor (legacy `image.pollinations.ai` auth hatası veriyordu)
- [x] ConnectPage.jsx — MetaMask zorunlu landing ekranı
- [x] MapGrid.jsx — SVG terrain haritası, hover tooltip ile aktivite seçimi
- [x] useBrain.js — wakeUp(), localStorage persist (brain_state), TX her zaman dene
- [x] useMonad.js — auto-reconnect, disconnect(), TX miktarı düzeltildi (0.000001 MON)
- [x] App.jsx — ConnectPage gate, wakeUp butonu, disconnect butonu, temiz layout
- [x] index.css — cleaner design tokens, pinPulse animasyonu

---

## MEVCUT DURUM
**v2.0 — Çalışıyor.**
- localhost:5173 aktif
- ConnectPage: MetaMask olmadan uygulama görünmez
- Harita: SVG hover tooltip ile lokasyon seçimi
- Gece döngüsü: currentDream yüklendikten sonra "Uyan" butonu çıkar
- TX: 0.000001 MON (görünür miktar)
- State persist: localStorage `brain_state`

---

## KRİTİK KARARLAR

### Pollinations
- **YANLIŞ**: `https://image.pollinations.ai/prompt/{encoded}?nologo=true` → localhost referrer'ı auth algılıyor
- **DOĞRU**: `https://pollinations.ai/p/{encoded}?width=800&height=500&seed={ts}&nologo=true`

### Monad TX
- Miktar: `max(tokensUsed * 0.000001, 0.000001)` MON — artık MetaMask popup'ta görünür
- `tx.wait(1)` — 1 blok bekleniyor

### ConnectPage
- `eth_accounts` ile auto-reconnect (sayfa yenilenince)
- `accountsChanged` event dinleniyor
- disconnect(): sadece local state temizler, MetaMask'ı kesmez

### Gündüz/Gece Döngüsü
- Gece: `isNight=true`, harita kilitlenir
- `wakeUp()`: token sıfırla, events sıfırla, dayNumber++, isNight=false
- Buton: yalnızca `isNight && currentDream` olduğunda gösterilir

### State Persist
- `localStorage.brain_state`: {dayNumber, events, tokenTotal, isNight, currentDream, taskCompleted, memorySummary}
- `localStorage.brain_dreams`: son 10 rüya

---

## BAŞARISIZ DENEMELER
| Hata | Çözüm |
|------|-------|
| `image.pollinations.ai` → 500 auth error | `pollinations.ai/p/` endpoint kullan |
| TX çalışmıyor | `account` yerine `eth_accounts` kontrol et + `tx.wait(1)` |

---

## ENV
```
VITE_OPENROUTER_API_KEY=sk-or-v1-... ✅
VITE_MONAD_RPC=https://testnet-rpc.monad.xyz
VITE_RECEIVER_ADDRESS=0x0000000000000000000000000000000000000001
```

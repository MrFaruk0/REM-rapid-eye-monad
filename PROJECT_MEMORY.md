# PROJECT_MEMORY.md
> Bu dosya her adımdan önce okunur, her adımdan sonra güncellenir.

---

## PROJE: Brain Agent (REM — Rapid Eye Monad)
**Son güncelleme:** 2026-04-23 — v2.9 ✅

---

## STACK
- Vite + React (create-vite@9.0.6)
- ethers.js v6 — MetaMask, native MON transfer, contract YOK
- OpenRouter API — metin: `mistralai/mistral-7b-instruct:free`
- Puter.js — Görsel üretim (`puter.ai.txt2img`), index.html head'inde script tag var
- Inline CSS + saf CSS (Tailwind/MUI/Chakra YASAK)

---

## TAMAMLANAN ADIMLAR (v2.3)
- [x] ConnectPage.jsx — MetaMask zorunlu landing ekranı
- [x] MapGrid.jsx — SVG terrain haritası, hover tooltip ile aktivite seçimi
- [x] useBrain.js — wakeUp(), localStorage persist (brain_state), TX her zaman dene
- [x] useMonad.js — auto-reconnect, disconnect(), TX miktarı düzeltildi (0.000001 MON)
- [x] App.jsx — ConnectPage gate, wakeUp butonu, disconnect butonu, temiz layout
- [x] index.css — cleaner design tokens, pinPulse animasyonu
- [x] Ödeme Önceliği: Aktivite başlamadan önce MetaMask TX alınması sağlandı.
- [x] Rüya Arşivi: memResult undefined hatası düzeltildi.
- [x] Arşiv Temizle butonu eklendi (DreamHistory.jsx header).
- [x] clearDreams currentDream'i silmeyecek şekilde düzeltildi (Uyan butonu kaybolmasın).
- [x] Gece arafında kalan kullanıcı için kurtarma butonu eklendi.
- [x] **Görsel Motoru → Tamamen OpenRouter'a Taşındı (v2.4):**
  - Model: `google/gemini-2.0-flash-exp:free`
  - Endpoint: `https://openrouter.ai/api/v1/chat/completions`
  - `modalities: ["image", "text"]` ile base64 data URL alınıyor
  - Puter.js ve Pollinations kod tabanından tamamen silindi
  - `index.html`'den `puter.js` script tag'i kaldırıldı
- [x] DreamHistory img: opacity fade-in mevcut. `objectFit: contain`, `maxHeight: 280px`, koyu arkaplan — görsel kanalda artık kırpılmıyor.
- [x] Dream prompt güncellendi: artık aktiviteye odaklı, az sürreal (painterly/natural tone).
- [x] **NFT Mint Düzeltildi (v2.9):** Puter.js görselı base64 data URL olarak döndürüyor. Bu string çok büyük olduğundan `metadataUri`'ye koyunca TX gas limitini aşıp `missing revert data` hatası veriyordu. Fixes: base64 ise `rem-dream://id` referansı yaz; description max 200 char ile sınırla.
- [x] Logo güncellendi: "Brain Agent" → "REM — Rapid Eye Monad"

---

## MEVCUT DURUM
**v2.3 — Çalışıyor.**
- localhost:5173 aktif
- ConnectPage: MetaMask olmadan uygulama görünmez
- Harita: SVG hover tooltip ile lokasyon seçimi
- Gece döngüsü: currentDream yüklendikten sonra "Uyan" butonu çıkar; takılı kalınırsa kurtarma butonu da var.
- TX: Aktiviteden önce MetaMask onayı istenir, reddedilirse aktivite durur.
- Görsel: OpenRouter `google/gemini-2.0-flash-exp:free` → base64 data URL → `<img src>`. Hata olursa url boş kalır, görsel alanı gizlenir.
- State persist: localStorage `brain_state` ve `brain_dreams`

---

## KRİTİK KARARLAR

### Görsel Motoru (v2.5 — GÜNCEL)
- **Motor: Puter.js** — `puter.ai.txt2img(prompt)` → `img.src`
- `index.html` `<head>` içinde `<script src="https://js.puter.com/v2/">` var
- OpenRouter görsel denemesi (Gemini modalities) — **BAŞARISIZ**, silindi
- Hata olursa `url = ""`, görsel alanı boş kalır

### Monad TX
- Miktar: `max(tokensUsed * 0.000001, 0.000001)` MON
- `tx.wait(1)` — 1 blok bekleniyor
- Ödeme her zaman işlemden ÖNCE alınır. İptal edilirse aktivite yapılmaz.

### ConnectPage
- `eth_accounts` ile auto-reconnect (sayfa yenilenince)
- `accountsChanged` event dinleniyor
- disconnect(): sadece local state temizler

### Gündüz/Gece Döngüsü
- Gece: `isNight=true`, harita kilitlenir
- `wakeUp()`: token sıfırla, events sıfırla, dayNumber++, isNight=false
- Buton: `isNight && currentDream` → normal buton; `isNight && !currentDream` → kurtarma butonu

### State Persist
- `localStorage.brain_state`: {dayNumber, events, tokenTotal, isNight, currentDream, taskCompleted, memorySummary}
- `localStorage.brain_dreams`: son 10 rüya

### clearDreams
- `currentDream`'i SİLMEZ (uyan butonu kaybolur)
- Sadece `brain_dreams` localStorage key'ini ve `dreams` state'ini temizler

---

## ENV
```
VITE_OPENROUTER_API_KEY=sk-or-v1-... ✅
VITE_MONAD_RPC=https://testnet-rpc.monad.xyz
VITE_RECEIVER_ADDRESS=0x0000000000000000000000000000000000000001
VITE_POLLINATION_API_KEY=sk_SWAErAYxnVLKIPEM5Viy6gEVl3ueTS3Y ✅ (authenticated key)
```

---

## BAŞARISIZ DENEMELER / BİLİNEN HATALAR
| Hata | Çözüm |
|------|-------|
| `image.pollinations.ai` → 500 auth error (anonim) | `?key=sk_...` ekle veya Puter kullan |
| `enter.pollinations.ai` — legacy endpoint mesajı | `image.pollinations.ai?key=...` kullan |
| Puter `txt2img` → catch | Puter hesabı yoksa hata verir, fallback devreye girer |
| Puter blob URL → localStorage'da bozulur | Puter data URL döndürüyor zaten (base64), sorun yok |
| `missing revert data` NFT mint sırasında | localStorage'daki contractAddress chain'de yok (testnet reset). `provider.getCode` ile kontrol et, "0x" ise yeniden deploy et |

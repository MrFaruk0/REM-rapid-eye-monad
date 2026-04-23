# PROJECT_MEMORY.md
> Bu dosya her adımdan önce okunur, her adımdan sonra güncellenir.

---

## PROJE: Brain Agent
**Son güncelleme:** 2026-04-23 — v2.2 ✅

---

## STACK
- Vite + React (create-vite@9.0.6)
- ethers.js v6 — MetaMask, native MON transfer, contract YOK
- OpenRouter API — `mistralai/mistral-7b-instruct:free`
- Puter.js — Görsel üretim (txt2img)
- Inline CSS + saf CSS (Tailwind/MUI/Chakra YASAK)

---

## TAMAMLANAN ADIMLAR (v2.2)
- [x] ConnectPage.jsx — MetaMask zorunlu landing ekranı
- [x] MapGrid.jsx — SVG terrain haritası, hover tooltip ile aktivite seçimi
- [x] useBrain.js — wakeUp(), localStorage persist (brain_state), TX her zaman dene
- [x] useMonad.js — auto-reconnect, disconnect(), TX miktarı düzeltildi (0.000001 MON)
- [x] App.jsx — ConnectPage gate, wakeUp butonu, disconnect butonu, temiz layout
- [x] index.css — cleaner design tokens, pinPulse animasyonu
- [x] Ödeme Önceliği: Aktivite başlamadan önce (Logic ve Memory'den evvel) MetaMask işlem onayı alınması sağlandı.
- [x] Rüya Arşivi ve Görsel Hatası: `memResult` undefined hatası düzeltilerek rüyaların arşive eklenmesi sağlandı.
- [x] **Pollinations Komple Kaldırıldı:** Pollinations API tamamen projeden çıkarıldı. Sadece Puter.js kullanılıyor. Puter.js'nin ürettiği görseller localStorage'da kaybolmasın diye kalıcı olarak Base64'e çevrilerek kaydediliyor.

---

## MEVCUT DURUM
**v2.2 — Çalışıyor.**
- localhost:5173 aktif
- ConnectPage: MetaMask olmadan uygulama görünmez
- Harita: SVG hover tooltip ile lokasyon seçimi
- Gece döngüsü: currentDream yüklendikten sonra "Uyan" butonu çıkar
- TX: Aktiviteden önce tahmini sabit bedel (120 token karşılığı) olarak MetaMask onayı istenir.
- Görsel Motoru: Sadece Puter.js (`window.puter.ai.txt2img`) devrede. Gelen görsel Base64'e çevrilir, başarısız olursa "Visual Cortex Offline" placeholder resmi gösterilir.
- State persist: localStorage `brain_state` ve `brain_dreams`

---

## KRİTİK KARARLAR

### Görsel Motoru
- **Puter.js**: Sadece Puter kullanılacak. Üretilen blob URL'si yeni sekmede veya sayfa yenilenmesinde kaybolduğu için `FileReader` ile Base64 stringine çevrilerek arşive (`localStorage`) eklendi.
- **Pollinations**: Sorunlu olduğu için (auth hataları, legacy endpoint kısıtlamaları) tamamen terk edildi ve koddan silindi.

### Monad TX
- Miktar: `max(tokensUsed * 0.000001, 0.000001)` MON — artık MetaMask popup'ta görünür
- `tx.wait(1)` — 1 blok bekleniyor
- Ödeme her zaman işlemden/aktiviteden ÖNCE alınır. İptal edilirse aktivite yapılmaz.

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
- `localStorage.brain_dreams`: son 10 rüya (Base64 resimlerle)

---

## ENV
```
VITE_OPENROUTER_API_KEY=sk-or-v1-... ✅
VITE_MONAD_RPC=https://testnet-rpc.monad.xyz
VITE_RECEIVER_ADDRESS=0x0000000000000000000000000000000000000001
```

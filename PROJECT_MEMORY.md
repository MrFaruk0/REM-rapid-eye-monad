# PROJECT_MEMORY.md
> Bu dosya her adımdan önce okunur, her adımdan sonra güncellenir.

---

## PROJE: Brain Agent
**Hackathon:** Monad Blitz  
**Süre:** 5 saat  
**Son güncelleme:** 2026-04-23 — v1.0 TAMAMLANDI ✅

---

## STACK (KESİN, DEĞİŞTİRME)
- Vite + React (create-vite@9.0.6, `--overwrite` flag ile mevcut dizinde kuruldu)
- ethers.js v6 (MetaMask, native MON transfer, contract YOK)
- OpenRouter API — model: `mistralai/mistral-7b-instruct:free`
- Pollinations.ai — ücretsiz görsel, API key yok
- Inline CSS + saf CSS (Tailwind, MUI, Chakra YASAK)

---

## TAMAMLANAN ADIMLAR
- [x] Proje kurulumu (npm create vite@latest . -- --template react --overwrite)
- [x] npm install ethers axios
- [x] Klasör yapısı: src/agents/, src/components/, src/hooks/, src/utils/
- [x] src/utils/tokenCounter.js — token takip modülü
- [x] src/utils/dreamPromptBuilder.js — Pollinations prompt üretici
- [x] src/hooks/useMonad.js — MetaMask + Monad testnet bağlantısı + native TX
- [x] src/hooks/useBrain.js — merkezi state, tüm ajan akışı koordinasyonu
- [x] src/agents/LogicAgent.js — aktivite yorumlayıcı (OpenRouter + mock fallback)
- [x] src/agents/MemoryAgent.js — hafıza özetleyici (OpenRouter + mock fallback)
- [x] src/agents/DreamAgent.js — rüya prompt üretici (OpenRouter + mock fallback)
- [x] src/components/BrainAvatar.jsx — nefes alan SVG beyin, gece/işlem modları
- [x] src/components/MapGrid.jsx — 3 lokasyon × 2 aktivite, hover efektleri
- [x] src/components/InnerVoicePanel.jsx — renkli badge'li canlı log akışı
- [x] src/components/TokenBar.jsx — animasyonlu progress bar, kırmızıya döner
- [x] src/components/DailyTask.jsx — günlük görev, tamamlanınca yeşil
- [x] src/components/DreamHistory.jsx — aktif rüya büyük + geçmiş grid
- [x] src/index.css — global stiller, animasyonlar, font imports, design tokens
- [x] src/App.jsx — tek sayfalık layout, parçacık arka planı, gece overlay
- [x] npm run dev — ✅ localhost:5173 çalışıyor

---

## MEVCUT DURUM
**v1.0 — Tam çalışır durumda.** 
- Sunucu: http://localhost:5173 (Vite dev server)
- UI: BRAIN AGENT header, BrainAvatar, DailyTask, MapGrid 3 lokasyon, InnerVoicePanel, TokenBar
- Akış: Aktivite seç → Logic+Memory ajan → Token harca → TX gönder → 500 token = Gece = DreamAgent → Pollinations görsel
- Mock fallback: OpenRouter yanıt vermezse mock response döner, uygulama durmuyor

---

## KRİTİK KARARLAR

### Vite Kurulumu
- Mevcut dizinde non-empty klasör: `--overwrite` flag kullanıldı
- `npm create vite@latest . -- --template react --overwrite` ✅

### Monad TX
- Contract YOK. Sadece native transfer.
- Alıcı adres: `0x0000000000000000000000000000000000000001` (burn address, demo için)
- Miktar: `tokens_used * 0.000000001 MON`
- Chain ID: `10143` (hex: `0x279F`)
- RPC: `https://testnet-rpc.monad.xyz`
- ethers v6 kullanıldı: `ethers.BrowserProvider`, `ethers.parseEther`

### Token Limiti
- Günlük limit: 500 token
- Mock token: her aktivite 45+50=95 token (Logic+Memory)
- Limit dolunca: DreamAgent çalışır → Pollinations görsel

### Pollinations
- URL formatı: `https://image.pollinations.ai/prompt/{encoded}?width=512&height=512&nologo=true&seed={timestamp}`
- Fetch GEREKMEZ, direkt img src olarak kullan
- seed parametresi eklendi (her çağrıda farklı görsel)

### OpenRouter
- Base URL: `https://openrouter.ai/api/v1/chat/completions`
- Header: `Authorization: Bearer ${key}`
- Header: `HTTP-Referer: http://localhost:5173`
- Model: `mistralai/mistral-7b-instruct:free`
- Max tokens: 150

### State Yönetimi
- useBrain.js merkezi state
- tokenCounter.js modül-level mutable (singleton pattern, React re-render gerek)
- localStorage: `brain_dreams` key, max 10 kayıt

---

## BAŞARISIZ DENEMELER
> Hata olunca buraya ekle. Bir daha aynı yolu deneme.

| Hata | Denenen Çözüm | Sonuç | Doğru Çözüm |
|------|---------------|-------|-------------|
| — | — | — | — |

---

## AÇIK SORUNLAR
Şu an yok.

---

## ENV DEĞİŞKENLERİ
```
VITE_OPENROUTER_API_KEY=sk-or-v1-...  ← kullanıcı tarafından sağlandı ✅
VITE_MONAD_RPC=https://testnet-rpc.monad.xyz
VITE_RECEIVER_ADDRESS=0x0000000000000000000000000000000000000001
```

---

## DEMO AKIŞI (test için ezber)
1. MetaMask bağlan (Monad testnet, Chain ID 10143)
2. Günlük görev görün (rotasyon: Yüzmek / Koşmak / Uyuklamak)
3. Haritadan aktivite seç (örn: Su Kıyısı → Yüzmek)
4. InnerVoice: System → Logic → Memory → TX logları
5. TokenBar artar, 500'e ulaşınca "GECE BAŞLIYOR" overlay
6. DreamAgent çalışır, Pollinations URL üretilir
7. Rüya görseli DreamHistory'de büyük gösterilir
8. Görev tamamlandıysa yeşil badge + ödül TX

---

## TOKEN VERİMLİLİK NOTLARI
- Agent system promptları kısa tut (max 2 cümle)
- OpenRouter'a max_tokens: 150 gönder
- Her aktivite için ayrı API çağrısı yap (batch değil)
- Memory summary kümülatif değil, sadece son 5 event

---

## DOSYA YAPISI (MEVCUT)
```
src/
  agents/
    LogicAgent.js       ✅
    MemoryAgent.js      ✅
    DreamAgent.js       ✅
  components/
    BrainAvatar.jsx     ✅
    MapGrid.jsx         ✅
    InnerVoicePanel.jsx ✅
    TokenBar.jsx        ✅
    DreamHistory.jsx    ✅
    DailyTask.jsx       ✅
  hooks/
    useBrain.js         ✅
    useMonad.js         ✅
  utils/
    tokenCounter.js     ✅
    dreamPromptBuilder.js ✅
  App.jsx               ✅
  index.css             ✅
  main.jsx              ✅ (Vite default, değiştirilmedi)
.env                    ✅ (kullanıcı tarafından oluşturuldu)
.gitignore              ✅ (.env dahil)
```

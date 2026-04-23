// Sleep Quality System — Uyku kalitesi ve rüya tier yönetimi

export const DREAM_TIERS = {
  nightmare: { key: 'nightmare', label: 'Kabus',   icon: '😱', min: 0,  max: 25,  color: '#7f1d1d', tokenMod: -0.30, nft: false },
  poor:      { key: 'poor',      label: 'Kötü',    icon: '😟', min: 25, max: 50,  color: '#4c1d95', tokenMod: -0.10, nft: false },
  normal:    { key: 'normal',    label: 'Normal',  icon: '😴', min: 50, max: 65,  color: '#1e3a5f', tokenMod:  0.00, nft: false },
  good:      { key: 'good',      label: 'İyi',     icon: '✨', min: 65, max: 80,  color: '#065f46', tokenMod: +0.10, nft: false },
  vivid:     { key: 'vivid',     label: 'Net',     icon: '🌟', min: 80, max: 92,  color: '#1d4ed8', tokenMod: +0.25, nft: false },
  legendary: { key: 'legendary', label: 'Efsane',  icon: '🏆', min: 92, max: 101, color: '#92400e', tokenMod: +0.40, nft: true  },
};

export function getDreamTier(quality) {
  const q = Math.max(0, Math.min(100, quality));
  for (const tier of Object.values(DREAM_TIERS)) {
    if (q >= tier.min && q < tier.max) return tier;
  }
  return DREAM_TIERS.legendary;
}

// Aktivitenin uyku kalitesine etkisi
const ACTIVITY_SLEEP_EFFECTS = {
  'Uyuklamak':          +10,
  'Meditasyon yapmak':  +8,
  'Yoga yapmak':        +7,
  'Müzik dinlemek':     +5,
  'Balık tutmak':       +3,
  'Kitap okumak':       +3,
  'Kumda oynamak':      +3,
  'Yemek yapmak':       +2,
  'Fotoğraf çekmek':    +2,
  'Yüzmek':             +1,
  'Koşmak':             +1,
  'Sörf yapmak':        -1,
  "Kafe'ye gitmek":     -1,
  'Alışveriş yapmak':   -2,
  'Tırmanmak':          -3,
};

export function getActivitySleepEffect(activity) {
  return ACTIVITY_SLEEP_EFFECTS[activity] ?? 0;
}

// Günlük token limitini uyku kalitesi tier'ına göre ayarla
export function applyTierToLimit(baseLimit, prevTier) {
  if (!prevTier) return baseLimit;
  const mod = DREAM_TIERS[prevTier]?.tokenMod ?? 0;
  return Math.round(baseLimit * (1 + mod));
}

export const MARKETPLACE_ITEMS = [
  { id: 'chamomile',  name: 'Papatya Çayı',         icon: '🍵', effect: +5,  price: 0.001, desc: 'Sakinleştirir, uyku kalitesini artırır' },
  { id: 'meditation', name: 'Rehberli Meditasyon',  icon: '🧘', effect: +12, price: 0.003, desc: 'Derin farkındalık, rüya netliği' },
  { id: 'sleepMask',  name: 'Uyku Maskesi',         icon: '😷', effect: +20, price: 0.005, desc: 'Tam karanlık, derin uyku garantisi' },
  { id: 'whiteNoise', name: 'Sessiz Ortam',         icon: '🔇', effect: +8,  price: 0.002, desc: 'Gürültüyü keser, zihin durulur' },
];

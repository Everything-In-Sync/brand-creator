const UINT32_MAX = 0xffffffff;

export function mulberry32(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / (UINT32_MAX + 1);
  };
}

export function normalizeSeed(seed) {
  if (typeof seed === 'number' && Number.isFinite(seed)) {
    return Math.abs(Math.floor(seed)) % UINT32_MAX;
  }
  if (typeof seed === 'string') {
    let h = 1779033703 ^ seed.length;
    for (let i = 0; i < seed.length; i += 1) {
      h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return Math.abs(h >>> 0);
  }
  return Math.floor(Math.random() * UINT32_MAX);
}

export function randomInt(rng, min, max) {
  const r = rng();
  return Math.floor(r * (max - min + 1)) + min;
}

export function randomFloat(rng, min, max) {
  return rng() * (max - min) + min;
}

export function randomPick(rng, items) {
  if (!items.length) {
    return undefined;
  }
  const idx = Math.floor(rng() * items.length);
  return items[idx];
}

export function shuffle(rng, items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

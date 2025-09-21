export const BRAND_TONES = [
  'conservative',
  'modern',
  'playful',
  'premium',
  'eco friendly',
  'trustworthy',
  'energetic',
  'minimal',
  'artisan',
  'techie',
  'healthcare',
  'finance',
  'hospitality',
  'education',
  'construction',
  'legal',
  'non profit',
  'restaurant',
  'retail',
  'beauty',
  'fitness',
  'automotive',
  'real estate'
];

export const TONE_PROFILES = {
  conservative: {
    saturation: 0.8,
    lightnessShift: -0.05,
    contrastPreference: 'dark'
  },
  modern: {
    saturation: 1.05,
    lightnessShift: 0,
    contrastPreference: 'dark'
  },
  playful: {
    saturation: 1.2,
    lightnessShift: 0.08,
    contrastPreference: 'dark'
  },
  premium: {
    saturation: 0.85,
    lightnessShift: -0.02,
    contrastPreference: 'light'
  },
  'eco friendly': {
    saturation: 0.9,
    lightnessShift: 0.04,
    contrastPreference: 'dark'
  },
  trustworthy: {
    saturation: 0.95,
    lightnessShift: 0,
    contrastPreference: 'dark'
  },
  energetic: {
    saturation: 1.15,
    lightnessShift: 0.05,
    contrastPreference: 'dark'
  },
  minimal: {
    saturation: 0.7,
    lightnessShift: 0.06,
    contrastPreference: 'dark'
  },
  artisan: {
    saturation: 1.05,
    lightnessShift: -0.01,
    contrastPreference: 'light'
  },
  techie: {
    saturation: 1.1,
    lightnessShift: -0.04,
    contrastPreference: 'light'
  },
  beauty: {
    saturation: 1.1,
    lightnessShift: 0.04,
    contrastPreference: 'dark'
  },
  healthcare: {
    saturation: 0.95,
    lightnessShift: 0.02,
    contrastPreference: 'dark'
  },
  finance: {
    saturation: 0.85,
    lightnessShift: -0.03,
    contrastPreference: 'light'
  },
  hospitality: {
    saturation: 1.0,
    lightnessShift: 0.03,
    contrastPreference: 'dark'
  },
  education: {
    saturation: 0.95,
    lightnessShift: 0.02,
    contrastPreference: 'dark'
  },
  construction: {
    saturation: 1.1,
    lightnessShift: -0.01,
    contrastPreference: 'light'
  },
  legal: {
    saturation: 0.8,
    lightnessShift: -0.05,
    contrastPreference: 'light'
  },
  'non profit': {
    saturation: 1.0,
    lightnessShift: 0.01,
    contrastPreference: 'dark'
  },
  restaurant: {
    saturation: 1.12,
    lightnessShift: 0.02,
    contrastPreference: 'dark'
  },
  retail: {
    saturation: 1.1,
    lightnessShift: 0.05,
    contrastPreference: 'dark'
  },
  fitness: {
    saturation: 1.15,
    lightnessShift: -0.02,
    contrastPreference: 'light'
  },
  automotive: {
    saturation: 1.05,
    lightnessShift: -0.03,
    contrastPreference: 'light'
  },
  'real estate': {
    saturation: 0.95,
    lightnessShift: -0.01,
    contrastPreference: 'light'
  }
};

export function getToneProfile(tone = 'trustworthy') {
  const normalized = tone.toLowerCase();
  return TONE_PROFILES[normalized] ?? TONE_PROFILES.trustworthy;
}

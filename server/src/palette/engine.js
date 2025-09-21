import chroma from 'chroma-js';
import { resolveIndustry, getIndustryProfile } from './industryMap.js';
import { getToneProfile } from './toneProfiles.js';
import { getFontPairs, SYSTEM_FALLBACK } from './fontSuggestions.js';
import { buildColorSummary, contrastRatio, clamp } from '../utils/color.js';
import { mulberry32, normalizeSeed, shuffle, randomPick } from '../utils/random.js';
import { ensureDistinguishable } from '../utils/colorblind.js';

const TEXT_LIGHT = '#FFFFFF';
const TEXT_DARK = '#111827';

const THEME_PREFERENCES = {
  'light-first': 'light-first',
  'dark-first': 'dark-first',
  'neutral-first': 'neutral-first'
};

const DEFAULT_THEME = 'light-first';

const ICON_CHOICES = {
  rounded: ['rounded', 'outline'],
  outline: ['outline', 'rounded'],
  sharp: ['sharp', 'geometric'],
  geometric: ['geometric', 'sharp'],
  handcrafted: ['handcrafted', 'rounded']
};

const IMAGERY_LIBRARY = {
  healthcare: ['clean clinical lighting with human warmth', 'calm gradients, smooth surfaces, precise instrumentation', 'natural healing textures, leafy botanicals, soft focus'],
  finance: ['polished corporate skylines and geometric patterns', 'subtle metallic textures with strong diagonals', 'steady horizon lines, lighthouse beacons, guiding visuals'],
  construction: ['bold structural beams, blueprint overlays, textured concrete', 'sunlit worksite silhouettes and safety gear closeups', 'macro textures of timber, steel, and stone with dust motes'],
  technology: ['futuristic gradients with glowing grids and birefringent light', 'isometric tech components with neon accents', 'ambient server rooms, fiber optics, holographic overlays'],
  beauty: ['soft focus portrait lighting with shimmering highlights', 'delicate florals, silky fabrics, gentle curves', 'macro cosmetics textures, brush strokes, glass refractions'],
  hospitality: ['sun-kissed interiors, warm woodgrain, inviting table settings', 'golden hour skylines, poolside reflections, hospitality moments', 'artisan food plating, hand-poured beverages, tactile linens'],
  education: ['sunlit libraries, tactile paper textures, study moments', 'chalk dust motion, classroom vignettes, curious expressions', 'campus architecture, collegiate iconography, open books'],
  legal: ['marble columns, brass scales, deep navy drapery', 'library stacks bathed in focused light, archival textures', 'close-up of hands over documents, pen poised'],
  restaurant: ['rustic wood tabletops, seasonal produce, steam curls', 'plated dishes with directional light, vibrant garnishes', 'open kitchen flames, artisan ceramics, chalkboard menus'],
  nonprofit: ['community gatherings with authentic smiles, candid moments', 'hands collaborating, textured paper cutouts, beaming light', 'macro shots of natural textures symbolizing growth and hope'],
  fitness: ['dynamic motion blur, chalk dust, gym rigs', 'sunrise outdoor training, high contrast silhouettes', 'close-ups of equipment textures, sweat droplets, energy lines']
};

const LOGO_MOTIFS = {
  healthcare: ['symbolic shield with heartbeat line', 'monogram with organic leaf negative space', 'cross motif blended with abstract wave'],
  finance: ['monogram with ascending bar chart forms', 'geometric crest with interlocking shapes', 'abstract pillar or column symbolizing stability'],
  construction: ['letterform built from angled beams', 'geodesic frame creating initials', 'bold badge with riveted outline and skyline'],
  technology: ['hexagonal monogram with circuitry lines', 'negative space lightning bolt between initials', 'orbiting rings forming stylized letter mark'],
  beauty: ['script monogram entwined with petals', 'geometric blossom with mirrored symmetry', 'minimal wordmark with flowing underline accent'],
  hospitality: ['crest with keyhole or door motif', 'sunrise horizon over waterline within circle', 'monogram framed by laurel and ribbon'],
  education: ['open book morphing into rising sun', 'shield with stylized quill and torch', 'stacked initials forming staircase'],
  legal: ['balanced scales hidden within letterforms', 'shield with pillar formed from initials', 'interlocking monogram with laurel arc'],
  restaurant: ['initials framed by utensils outline', 'circular stamp with grain pattern and script', 'minimal wordmark with flame accent'],
  nonprofit: ['hands forming heart negative space', 'radiating lines surrounding anchor symbol', 'abstract dove formed by overlapping shapes'],
  fitness: ['letter mark with motion streaks', 'badge with stylized lightning bolt', 'monogram formed by angular weights']
};

const ROLE_USAGE = {
  primary: 'Use for hero areas, headline accents, and primary call-to-action buttons.',
  secondary: 'Apply to supporting components like secondary buttons, tabs, and highlights.',
  accent: 'Use sparingly for interactive states, notifications, and key data points.',
  neutral: 'Ideal for cards, panels, and surfaces that need gentle separation.',
  background: 'Set as the foundational canvas for layouts, sections, and full-bleed areas.'
};

const DEFAULT_IMAGERY = ['soft diffused lighting over clean surfaces', 'geometric overlays with subtle gradients', 'macro textures that reinforce material quality'];
const DEFAULT_LOGO_MOTIFS = ['monogram with negative space detail', 'badge featuring layered geometric forms', 'abstract mark referencing industry themes'];

function applyTone(hex, toneProfile) {
  const [h, s, l] = chroma(hex).hsl();
  const saturation = clamp(s * toneProfile.saturation, 0, 1);
  const lightness = clamp(l + toneProfile.lightnessShift, 0, 1);
  return chroma.hsl(h, saturation, lightness).hex();
}

function adjustForTheme(baseColors, themePreference) {
  const theme = THEME_PREFERENCES[themePreference] ?? DEFAULT_THEME;
  const adjusted = { ...baseColors };
  if (theme === 'dark-first') {
    adjusted.background = chroma(baseColors.background).darken(2).hex();
    adjusted.neutral = chroma(baseColors.neutral).darken(0.8).hex();
    adjusted.primary = chroma(baseColors.primary).brighten(0.3).hex();
    adjusted.secondary = chroma(baseColors.secondary).brighten(0.3).hex();
  } else if (theme === 'neutral-first') {
    adjusted.background = chroma.mix(baseColors.background, '#F5F5F7', 0.6, 'lab').hex();
    adjusted.neutral = chroma.mix(baseColors.neutral, '#E4E6EB', 0.5, 'lab').hex();
  } else {
    // light-first
    adjusted.background = chroma(baseColors.background).brighten(0.2).hex();
    adjusted.neutral = chroma(baseColors.neutral).brighten(0.1).hex();
  }
  return adjusted;
}

function ensureAccessibility(baseColors) {
  const primary = chroma(baseColors.primary).luminance() < 0.2
    ? chroma(baseColors.primary).brighten(0.4).hex()
    : baseColors.primary;
  let accent = baseColors.accent;
  if (!ensureDistinguishable(primary, accent, 12)) {
    accent = chroma(accent).set('hsl.h', (chroma(accent).get('hsl.h') + 35) % 360).saturate(0.2).hex();
  }
  const background = baseColors.background;
  const neutral = baseColors.neutral;
  return {
    primary,
    secondary: baseColors.secondary,
    accent,
    neutral,
    background
  };
}

function buildRoles(colors, toneProfile) {
  const primary = buildColorSummary('primary', colors.primary, toneProfile.contrastPreference, 4.5);
  const secondary = buildColorSummary('secondary', colors.secondary, 'dark', 3.0);
  const accent = buildColorSummary('accent', colors.accent, 'light', 4.5);
  const neutral = buildColorSummary('neutral', colors.neutral, 'dark', 4.5);
  const background = buildColorSummary('background', colors.background, 'dark', 4.5);

  return {
    primary: { ...primary, usage: ROLE_USAGE.primary },
    secondary: { ...secondary, usage: ROLE_USAGE.secondary },
    accent: { ...accent, usage: ROLE_USAGE.accent },
    neutral: { ...neutral, usage: ROLE_USAGE.neutral },
    background: { ...background, usage: ROLE_USAGE.background }
  };
}

function generateSwatches(primary, secondary, accent, neutral, background) {
  const textContrastHex = chroma(primary.hex).luminance() > 0.5 ? TEXT_DARK : TEXT_LIGHT;
  const swatches = [
    {
      role: 'base-100',
      hex: chroma(primary.hex).brighten(1.2).hex()
    },
    {
      role: 'base-500',
      hex: primary.hex
    },
    {
      role: 'accent-400',
      hex: accent.hex
    },
    {
      role: 'neutral-200',
      hex: neutral.hex
    },
    {
      role: 'contrast',
      hex: textContrastHex
    }
  ];
  return swatches.map((swatch) => ({
    ...buildColorSummary(swatch.role, swatch.hex, 'dark', 4.5)
  }));
}

function contrastHexFor(textOn) {
  return textOn === 'light' ? TEXT_LIGHT : TEXT_DARK;
}

function selectIconStyle(profile, tone, rng) {
  const base = profile.defaultIconStyles ?? ['outline'];
  if (tone === 'playful') {
    return randomPick(rng, ICON_CHOICES.rounded);
  }
  if (tone === 'minimal') {
    return 'geometric';
  }
  if (tone === 'artisan') {
    return 'handcrafted';
  }
  return randomPick(rng, base);
}

function buildImagery(industryKey) {
  return IMAGERY_LIBRARY[industryKey] ?? DEFAULT_IMAGERY;
}

function buildLogoPrompts(industryKey) {
  return LOGO_MOTIFS[industryKey] ?? DEFAULT_LOGO_MOTIFS;
}

function pickNameSeed(seeds, rng, tone, contextEnabled, contextData) {
  const baseSeed = randomPick(rng, seeds);
  if (!contextEnabled || !contextData) {
    return baseSeed;
  }
  const adjectives = [];
  if (contextData?.values?.length) {
    adjectives.push(contextData.values[0]);
  }
  if (contextData?.audience?.length) {
    adjectives.push(contextData.audience[0]);
  }
  if (adjectives.length) {
    return `${capitalize(adjectives[0])} ${baseSeed}`;
  }
  if (contextData?.businessName) {
    return `${contextData.businessName.split(' ')[0]} ${baseSeed}`;
  }
  return `${capitalize(tone)} ${baseSeed}`;
}

function capitalize(value) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function preprocessContext(contextEnabled, contextDataRaw) {
  if (!contextEnabled) {
    return null;
  }
  const values = contextDataRaw?.values
    ? contextDataRaw.values.split(',').map((v) => v.trim()).filter(Boolean)
    : [];
  const audience = contextDataRaw?.audience
    ? contextDataRaw.audience.split(',').map((v) => v.trim()).filter(Boolean)
    : [];
  const competitors = contextDataRaw?.competitors
    ? contextDataRaw.competitors.split(/[,\n]/).map((v) => v.trim()).filter(Boolean)
    : [];
  return {
    businessName: contextDataRaw?.businessName ?? '',
    tagline: contextDataRaw?.tagline ?? '',
    values,
    audience,
    competitors,
    notes: contextDataRaw?.notes ?? ''
  };
}

function buildPreview(roles) {
  const primaryTextHex = contrastHexFor(roles.primary.textOn);
  const accentTextHex = contrastHexFor(roles.accent.textOn);
  const neutralTextHex = contrastHexFor(roles.neutral.textOn);
  return {
    button: {
      background: roles.primary.hex,
      text: primaryTextHex,
      contrast: contrastRatio(roles.primary.hex, primaryTextHex)
    },
    buttonAlt: {
      background: roles.accent.hex,
      text: accentTextHex,
      contrast: contrastRatio(roles.accent.hex, accentTextHex)
    },
    heading: {
      color: roles.secondary.hex,
      background: roles.background.hex,
      contrast: contrastRatio(roles.secondary.hex, roles.background.hex)
    },
    card: {
      background: roles.neutral.hex,
      border: chroma(roles.primary.hex).alpha(0.2).css(),
      text: neutralTextHex
    }
  };
}

export function generatePalettes(options) {
  const {
    industry,
    brandTone,
    themePreference,
    seed,
    contextEnabled = false,
    contextData: contextDataRaw
  } = options;

  const normalizedSeed = normalizeSeed(seed ?? 0);
  const rng = mulberry32(normalizedSeed);
  const industryKey = resolveIndustry(industry);
  const profile = getIndustryProfile(industryKey);
  const defaultToneByIndustry = {
    healthcare: 'healthcare',
    finance: 'finance',
    construction: 'construction',
    technology: 'techie',
    beauty: 'beauty',
    hospitality: 'hospitality',
    education: 'education',
    legal: 'legal',
    restaurant: 'restaurant',
    nonprofit: 'non profit',
    fitness: 'fitness'
  };
  const toneKey = (brandTone && brandTone.trim())
    ? brandTone.trim().toLowerCase()
    : (defaultToneByIndustry[industryKey] ?? 'trustworthy');
  const toneProfile = getToneProfile(toneKey);
  const templates = profile.paletteTemplates ?? [];
  const templateSelection = shuffle(rng, templates).slice(0, 3);
  const contextData = preprocessContext(contextEnabled, contextDataRaw);
  const fontPairs = getFontPairs(toneKey);

  const palettes = templateSelection.map((template, index) => {
    const base = {
      primary: applyTone(template.primary, toneProfile),
      secondary: applyTone(template.secondary, toneProfile),
      accent: applyTone(template.accent, toneProfile),
      neutral: applyTone(template.neutral, {
        ...toneProfile,
        saturation: Math.max(0.6, toneProfile.saturation * 0.8)
      }),
      background: applyTone(template.background, {
        ...toneProfile,
        saturation: Math.max(0.4, toneProfile.saturation * 0.7),
        lightnessShift: toneProfile.lightnessShift * 1.2
      })
    };

    const themed = adjustForTheme(base, themePreference);
    const accessible = ensureAccessibility(themed);
    const roles = buildRoles(accessible, toneProfile);

    const swatches = generateSwatches(roles.primary, roles.secondary, roles.accent, roles.neutral, roles.background);

    const paletteName = `${pickNameSeed(template.nameSeeds, rng, brandTone ?? 'Trustworthy', contextEnabled, contextData)} ${paletteSuffix(index, toneProfile, rng)}`;

    const iconStyle = selectIconStyle(profile, toneKey, rng);
    const imagery = buildImagery(industryKey);
    const logoPrompts = buildLogoPrompts(industryKey);

    return {
      name: paletteName,
      roles,
      swatches,
      previews: buildPreview(roles),
      typography: {
        headline: fontPairs[0].headline,
        headlineWeights: fontPairs[0].headlineWeights,
        body: fontPairs[0].body,
        bodyWeights: fontPairs[0].bodyWeights,
        links: fontPairs.map((pair) => pair.importUrl),
        pairs: fontPairs,
        fallback: SYSTEM_FALLBACK
      },
      iconStyle,
      imagery,
      logoPrompts,
      seedBack: normalizedSeed + index
    };
  });

  return palettes;
}

function paletteSuffix(index, toneProfile, rng) {
  const suffixes = ['Collective', 'Framework', 'Essence', 'Spectrum', 'Assembly'];
  const toneSuffix = toneProfile.contrastPreference === 'light' ? 'Edition' : 'Series';
  if (index === 0) {
    return toneSuffix;
  }
  return randomPick(rng, suffixes) ?? toneSuffix;
}

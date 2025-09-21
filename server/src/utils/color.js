import chroma from 'chroma-js';

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function hexToRgbArray(hex) {
  const normalized = chroma(hex).rgb();
  return normalized.map((c) => Math.round(c));
}

export function hexToHsl(hex) {
  const [h, s, l] = chroma(hex).hsl();
  return [roundTo(h, 2), roundTo(s * 100, 2), roundTo(l * 100, 2)];
}

export function rgbToHex(rgb) {
  return chroma(rgb).hex();
}

export function relativeLuminance(hex) {
  const lum = chroma(hex).luminance();
  return roundTo(lum, 4);
}

export function contrastRatio(hex1, hex2) {
  return roundTo(chroma.contrast(hex1, hex2), 2);
}

export function adjustLightness(hex, delta) {
  const color = chroma(hex).hsl();
  const adjusted = chroma.hsl(color[0], color[1], clamp(color[2] + delta, 0, 1));
  return adjusted.hex();
}

export function adjustSaturation(hex, factor) {
  const [h, s, l] = chroma(hex).hsl();
  const adjusted = chroma.hsl(h, clamp(s * factor, 0, 1), l);
  return adjusted.hex();
}

export function ensureContrast(base, preferredText, minRatio) {
  const lightText = '#FFFFFF';
  const darkText = '#121212';
  const testLight = contrastRatio(base, lightText);
  const testDark = contrastRatio(base, darkText);

  if (preferredText === 'light') {
    if (testLight >= minRatio) {
      return { text: 'light', contrast: testLight };
    }
    if (testDark >= minRatio) {
      return { text: 'dark', contrast: testDark };
    }
  } else {
    if (testDark >= minRatio) {
      return { text: 'dark', contrast: testDark };
    }
    if (testLight >= minRatio) {
      return { text: 'light', contrast: testLight };
    }
  }

  // Adjust lightness iteratively to meet minimum contrast
  let color = chroma(base);
  for (let i = 0; i < 12; i += 1) {
    const luminance = color.luminance();
    const target = preferredText === 'light' ? clamp(luminance - 0.05, 0, 1) : clamp(luminance + 0.05, 0, 1);
    color = color.luminance(target);
    const cLight = contrastRatio(color.hex(), lightText);
    const cDark = contrastRatio(color.hex(), darkText);
    if (cLight >= minRatio || cDark >= minRatio) {
      return cLight >= cDark
        ? { text: 'light', contrast: cLight, adjustedHex: color.hex() }
        : { text: 'dark', contrast: cDark, adjustedHex: color.hex() };
    }
  }

  // Fallback to whichever is higher contrast
  if (testDark >= testLight) {
    return { text: 'dark', contrast: testDark };
  }
  return { text: 'light', contrast: testLight };
}

export function roundTo(value, places) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

export function buildColorSummary(role, hex, preferredText = 'dark', minRatio = 4.5) {
  const contrastInfo = ensureContrast(hex, preferredText, minRatio);
  const rgb = hexToRgbArray(contrastInfo?.adjustedHex ?? hex);
  const hsl = hexToHsl(contrastInfo?.adjustedHex ?? hex);
  const luminance = relativeLuminance(contrastInfo?.adjustedHex ?? hex);
  const finalHex = contrastInfo?.adjustedHex ?? hex;
  return {
    role,
    hex: finalHex,
    rgb,
    hsl,
    luminance,
    textOn: contrastInfo.text,
    contrastOnText: contrastInfo.contrast
  };
}

export function mixColors(hexA, hexB, ratio = 0.5) {
  return chroma.mix(hexA, hexB, ratio, 'rgb').hex();
}

export function lightenToContrast(hex, desiredText = 'dark', minRatio = 4.5) {
  let color = chroma(hex);
  for (let i = 0; i < 10; i += 1) {
    const info = ensureContrast(color.hex(), desiredText, minRatio);
    if (info.contrast >= minRatio) {
      return color.hex();
    }
    color = desiredText === 'dark' ? color.brighten(0.3) : color.darken(0.3);
  }
  return color.hex();
}

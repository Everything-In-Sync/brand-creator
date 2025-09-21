import chroma from 'chroma-js';
import type { Palette } from '../types';

const TEXT_LIGHT = '#FFFFFF';
const TEXT_DARK = '#111827';

export function buildCssTokens(palette: Palette): string {
  const pairs = buildPairs(palette);
  const root = pairs.map((pair) => `  --brand-${pair.key}: ${pair.value};`).join('\n');
  const dark = pairs.map((pair) => `  --brand-${pair.key}: ${pair.darkValue};`).join('\n');
  return `:root {\n${root}\n}\n\n:root[data-theme="dark"], .theme-dark {\n${dark}\n}\n`;
}

export function buildScssTokens(palette: Palette): string {
  const pairs = buildPairs(palette);
  const light = pairs.map((pair) => `$brand-${pair.key}: ${pair.value};`);
  const dark = pairs.map((pair) => `$brand-${pair.key}-dark: ${pair.darkValue};`);
  return [...light, '', ...dark, ''].join('\n');
}

export function buildTailwindSnippet(palette: Palette): string {
  return `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n        brand: {\n          primary: '${palette.roles.primary.hex}',\n          secondary: '${palette.roles.secondary.hex}',\n          accent: '${palette.roles.accent.hex}',\n          neutral: '${palette.roles.neutral.hex}',\n          background: '${palette.roles.background.hex}'\n        }\n      }\n    }\n  }\n};\n`;
}

export function buildPaletteJson(palette: Palette): string {
  return JSON.stringify(palette, null, 2);
}

function buildPairs(palette: Palette) {
  const entries: Array<{ key: string; value: string; darkValue: string }> = [];
  Object.entries(palette.roles).forEach(([role, data]) => {
    entries.push({
      key: `${role}`,
      value: data.hex,
      darkValue: adjustForDark(data.hex)
    });
    entries.push({
      key: `${role}-rgb`,
      value: data.rgb.join(', '),
      darkValue: chroma(adjustForDark(data.hex)).rgb().map((n) => Math.round(n)).join(', ')
    });
    entries.push({
      key: `${role}-contrast`,
      value: contrastHex(data.textOn),
      darkValue: contrastHex(data.textOn === 'light' ? 'dark' : 'light')
    });
  });
  return entries;
}

function adjustForDark(hex: string): string {
  const color = chroma(hex);
  const luminance = color.luminance();
  const target = luminance > 0.45 ? color.darken(1.2) : color.brighten(1.1);
  return target.hex();
}

function contrastHex(text: string): string {
  return text === 'light' ? TEXT_LIGHT : TEXT_DARK;
}

import test from 'node:test';
import assert from 'node:assert/strict';
import { generatePalettes } from '../src/palette/engine.js';
import { relativeLuminance } from '../src/utils/color.js';

test('deterministic output with seed for healthcare conservative', () => {
  const options = {
    industry: 'healthcare',
    brandTone: 'conservative',
    themePreference: 'light-first',
    seed: 42,
    contextEnabled: false,
    contextData: null
  };
  const first = generatePalettes(options);
  const second = generatePalettes(options);
  assert.deepStrictEqual(first, second);
});

test('business context ignored when disabled', () => {
  const baseOptions = {
    industry: 'legal',
    brandTone: 'conservative',
    themePreference: 'light-first',
    seed: 101,
    contextEnabled: false,
    contextData: {
      businessName: 'Covenant Law',
      tagline: 'Justice with Clarity',
      values: 'Integrity,Clarity',
      audience: 'Enterprise,Startups',
      competitors: 'Firm A, Firm B',
      notes: 'Important prospects'
    }
  };
  const emptyContext = {
    ...baseOptions,
    contextData: null
  };
  const withContext = generatePalettes(baseOptions);
  const withoutContext = generatePalettes(emptyContext);
  assert.deepStrictEqual(withContext, withoutContext);
});

test('dark theme enforces dark background with light text', () => {
  const palettes = generatePalettes({
    industry: 'tech',
    brandTone: 'techie',
    themePreference: 'dark-first',
    seed: 7,
    contextEnabled: false,
    contextData: null
  });
  const darkPalette = palettes[0];
  const backgroundLum = relativeLuminance(darkPalette.roles.background.hex);
  assert.ok(backgroundLum < 0.35, 'Background should be darker in dark-first theme');
  assert.equal(darkPalette.roles.primary.textOn, 'light');
});

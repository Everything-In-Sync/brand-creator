import chroma from 'chroma-js';

const COLORBLIND_MATRICES = {
  protanopia: [
    [0.56667, 0.43333, 0],
    [0.55833, 0.44167, 0],
    [0, 0.24167, 0.75833]
  ],
  deuteranopia: [
    [0.625, 0.375, 0],
    [0.7, 0.3, 0],
    [0, 0.3, 0.7]
  ],
  tritanopia: [
    [0.95, 0.05, 0],
    [0, 0.43333, 0.56667],
    [0, 0.475, 0.525]
  ]
};

function linearize(value) {
  const v = value / 255;
  if (v <= 0.04045) {
    return v / 12.92;
  }
  return ((v + 0.055) / 1.055) ** 2.4;
}

function delinearize(value) {
  if (value <= 0.0031308) {
    return value * 12.92;
  }
  return 1.055 * value ** (1 / 2.4) - 0.055;
}

function applyMatrix(rgb, matrix) {
  const [r, g, b] = rgb.map((value) => linearize(value));
  const rPrime = matrix[0][0] * r + matrix[0][1] * g + matrix[0][2] * b;
  const gPrime = matrix[1][0] * r + matrix[1][1] * g + matrix[1][2] * b;
  const bPrime = matrix[2][0] * r + matrix[2][1] * g + matrix[2][2] * b;
  const toByte = (value) => Math.round(clamp(delinearize(value), 0, 1) * 255);
  return [toByte(rPrime), toByte(gPrime), toByte(bPrime)];
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function simulateColorBlindness(hex, type) {
  const matrix = COLORBLIND_MATRICES[type];
  if (!matrix) {
    return hex;
  }
  const rgb = chroma(hex).rgb();
  const transformed = applyMatrix(rgb, matrix);
  return chroma(transformed).hex();
}

export function minimumDeltaE(hexA, hexB) {
  return Math.min(
    chroma.deltaE(hexA, hexB),
    chroma.deltaE(simulateColorBlindness(hexA, 'protanopia'), simulateColorBlindness(hexB, 'protanopia')),
    chroma.deltaE(simulateColorBlindness(hexA, 'deuteranopia'), simulateColorBlindness(hexB, 'deuteranopia')),
    chroma.deltaE(simulateColorBlindness(hexA, 'tritanopia'), simulateColorBlindness(hexB, 'tritanopia'))
  );
}

export function ensureDistinguishable(hexA, hexB, threshold = 12) {
  const delta = minimumDeltaE(hexA, hexB);
  return delta >= threshold;
}

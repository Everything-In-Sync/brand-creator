import type { FormState, GenerateResponse } from '../types';

export async function fetchIndustries(): Promise<string[]> {
  const res = await fetch('/api/generate/industries');
  if (!res.ok) {
    return [];
  }
  const data = await res.json();
  return data.industries ?? [];
}

export async function generatePalettes(payload: FormState): Promise<GenerateResponse> {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      industry: payload.industry,
      brandTone: payload.brandTone || undefined,
      businessName: payload.businessName || undefined,
      tagline: payload.tagline || undefined,
      values: payload.values || undefined,
      audience: payload.audience || undefined,
      competitors: payload.competitors || undefined,
      notes: payload.notes || undefined,
      randomSeed: payload.randomSeed ? Number(payload.randomSeed) : undefined,
      themePreference: payload.themePreference || undefined,
      useBusinessContext: payload.useBusinessContext
    })
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || 'Failed to generate palettes');
  }

  return res.json();
}

export async function downloadZip(sessionId: string, paletteIndex: number): Promise<void> {
  const res = await fetch(`/api/export?sessionId=${encodeURIComponent(sessionId)}&paletteIndex=${paletteIndex}`);
  if (!res.ok) {
    throw new Error('Failed to build export package');
  }
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'brand-package.zip';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

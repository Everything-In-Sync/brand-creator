import type { Palette } from '../types';

interface TypographyPanelProps {
  palette: Palette;
}

export function TypographyPanel({ palette }: TypographyPanelProps) {
  return (
    <div className="typography-card">
      <h3 style={{ margin: 0 }}>Typeface Pairs</h3>
      {palette.typography.pairs.map((pair) => (
        <div key={`${pair.headline}-${pair.body}`} className="typography-pair">
          <div style={{ fontWeight: 600 }}>{pair.headline} · {pair.headlineWeights.join(', ')}</div>
          <div style={{ opacity: 0.8 }}>{pair.body} · {pair.bodyWeights.join(', ')}</div>
          <small>{pair.importUrl}</small>
        </div>
      ))}
      <small>Fallback stack: {palette.typography.fallback}</small>
    </div>
  );
}

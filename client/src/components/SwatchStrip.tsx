import type { ColorRole } from '../types';

interface SwatchStripProps {
  swatches: ColorRole[];
}

export function SwatchStrip({ swatches }: SwatchStripProps) {
  return (
    <div className="swatch-strip">
      {swatches.map((swatch) => (
        <div key={swatch.role} className="swatch-tile" style={{ background: swatch.hex, color: swatch.textOn === 'light' ? '#FFFFFF' : '#0F172A' }}>
          <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8 }}>{swatch.role}</span>
          <strong>{swatch.hex}</strong>
        </div>
      ))}
    </div>
  );
}

import type { ColorRole } from '../types';

interface RoleCardProps {
  label: string;
  data: ColorRole;
}

const TEXT_LIGHT = '#FFFFFF';
const TEXT_DARK = '#0F172A';

export function RoleCard({ label, data }: RoleCardProps) {
  const textColor = data.textOn === 'light' ? TEXT_LIGHT : TEXT_DARK;
  return (
    <div className="role-card" aria-label={`${label} color`}> 
      <div
        className="role-color"
        style={{ background: data.hex, color: textColor }}
      >
        <span style={{ fontSize: '0.85rem', letterSpacing: '0.04em', textTransform: 'uppercase', opacity: 0.8 }}>
          {label}
        </span>
        <strong style={{ fontSize: '1.25rem' }}>{data.hex}</strong>
        <span style={{ fontSize: '0.85rem' }}>{data.rgb.join(', ')}</span>
      </div>
      <div className="role-meta">
        <div><strong>Contrast:</strong> {data.contrastOnText}:1</div>
        <div><strong>Luminance:</strong> {data.luminance}</div>
        {data.usage && <div>{data.usage}</div>}
      </div>
    </div>
  );
}

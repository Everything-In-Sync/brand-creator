import type { Palette } from '../types';

interface PreviewPanelProps {
  palette: Palette;
  darkPreview: boolean;
}

const TEXT_DARK = '#0F172A';
const TEXT_LIGHT = '#FFFFFF';

export function PreviewPanel({ palette, darkPreview }: PreviewPanelProps) {
  const surface = darkPreview ? palette.roles.background.hex : '#FFFFFF';
  const text = darkPreview ? TEXT_LIGHT : TEXT_DARK;

  return (
    <div className="preview-panel" style={{ background: surface, color: text, borderRadius: 18, padding: 24, boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)' }}>
      <div className="preview-row">
        <div className="preview-heading" style={{ background: palette.roles.background.hex, color: palette.roles.secondary.hex, border: `1px solid ${palette.roles.secondary.hex}30` }}>
          Sample Heading
        </div>
        <div className="preview-button" style={{ background: palette.previews.button.background, color: palette.previews.button.text }}>
          Primary Action
        </div>
        <div className="preview-button" style={{ background: palette.previews.buttonAlt.background, color: palette.previews.buttonAlt.text }}>
          Accent Action
        </div>
      </div>
      <div className="preview-card" style={{ background: palette.roles.neutral.hex, color: palette.previews.card.text, border: `1px solid ${palette.previews.card.border}` }}>
        <strong style={{ display: 'block', marginBottom: 8 }}>Card Title</strong>
        <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>
          Preview body copy demonstrating contrast on neutral surfaces. Buttons and interactive states
          maintain AA standards.
        </p>
        <button
          type="button"
          style={{
            marginTop: 12,
            border: 'none',
            borderRadius: 999,
            padding: '10px 18px',
            fontWeight: 600,
            background: palette.roles.primary.hex,
            color: palette.previews.button.text
          }}
        >
          CTA Button
        </button>
      </div>
    </div>
  );
}

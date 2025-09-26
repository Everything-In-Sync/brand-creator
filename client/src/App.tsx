import { useEffect, useMemo, useState } from 'react';
import { RoleCard } from './components/RoleCard';
import { SwatchStrip } from './components/SwatchStrip';
import { PreviewPanel } from './components/PreviewPanel';
import { TypographyPanel } from './components/TypographyPanel';
import { ExportActions } from './components/ExportActions';
import logoImage from '../assets/images/logo.png';
import type { FormState, Palette, ThemePreference } from './types';
import { fetchIndustries, generatePalettes, downloadZip } from './lib/api';

const toneOptions = [
  'Conservative',
  'Modern',
  'Playful',
  'Premium',
  'Eco Friendly',
  'Trustworthy',
  'Energetic',
  'Minimal',
  'Artisan',
  'Techie',
];

const themeOptions: ThemePreference[] = ['light-first', 'dark-first', 'neutral-first'];

function formatIndustryLabel(value: string) {
  return value
    .split(/\s+/)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

const defaultForm: FormState = {
  industry: '',
  brandTone: '',
  businessName: '',
  tagline: '',
  values: '',
  audience: '',
  competitors: '',
  notes: '',
  randomSeed: '',
  themePreference: 'light-first',
  useBusinessContext: false
};

function App() {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [industries, setIndustries] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [status, setStatus] = useState<string>('');
  const [darkPreview, setDarkPreview] = useState<boolean>(false);

  useEffect(() => {
    fetchIndustries().then(setIndustries).catch(() => setIndustries([]));
  }, []);

  const activePalette = useMemo(() => palettes[activeIndex], [palettes, activeIndex]);

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    if (!form.industry) {
      setError('Industry is required.');
      return;
    }
    setLoading(true);
    setStatus('Generating palettes…');
    try {
      const payload = await generatePalettes(form);
      setPalettes(payload.palettes);
      setSessionId(payload.sessionId);
      setActiveIndex(0);
      setStatus(`Generated ${payload.palettes.length} palettes using seed ${payload.input.seed}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to generate palettes.');
      setPalettes([]);
      setSessionId(undefined);
      setStatus('');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      
      <aside className="sidebar">
      <a href="https://sandhillsgeeks.com"><img className="brand-logo" src={logoImage} alt="Brand Creator logo" /></a>
        <div className="sidebar-hero">

          <div>
            <h1>Branding Package Generator</h1>
            <p>Create deterministic, accessible palette sets tailored to each industry. Business context stays internal unless you enable it.</p>
          </div>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="industry">Industry *</label>
            <input
              id="industry"
              list="industry-options"
              placeholder="Healthcare, Finance, Construction…"
              value={form.industry}
              onChange={(event) => updateField('industry', event.target.value)}
            />
            <datalist id="industry-options">
              {industries.map((industry) => (
                <option key={industry} value={formatIndustryLabel(industry)} />
              ))}
            </datalist>
          </div>

          <div>
            <label htmlFor="tone">Brand Tone</label>
            <select
              id="tone"
              value={form.brandTone}
              onChange={(event) => updateField('brandTone', event.target.value)}
            >
              <option value="">Auto detect</option>
              {toneOptions.map((tone) => (
                <option key={tone} value={tone}>{tone}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="theme">Theme Preference</label>
            <select
              id="theme"
              value={form.themePreference}
              onChange={(event) => updateField('themePreference', event.target.value as ThemePreference)}
            >
              {themeOptions.map((theme) => (
                <option key={theme} value={theme}>{theme}</option>
              ))}
            </select>
            <small>Light or dark weighting for surface tokens. Seed still deterministically drives palette selection.</small>
          </div>

          <div>
            <label htmlFor="seed">Random Seed</label>
            <input
              id="seed"
              type="number"
              inputMode="numeric"
              placeholder="Optional numeric seed"
              value={form.randomSeed}
              onChange={(event) => updateField('randomSeed', event.target.value)}
            />
            <small>Provide a seed to reproduce results. Leave blank for auto seed.</small>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input
              id="useContext"
              type="checkbox"
              checked={form.useBusinessContext}
              onChange={(event) => updateField('useBusinessContext', event.target.checked)}
            />
            <label htmlFor="useContext" style={{ fontWeight: 500 }}>Use Business Context in Generation</label>
          </div>
          <small>When disabled, business fields stay internal and do not impact colors.</small>

          <div>
            <label htmlFor="businessName">Business Name</label>
            <input
              id="businessName"
              placeholder="Optional"
              value={form.businessName}
              onChange={(event) => updateField('businessName', event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="tagline">Tagline</label>
            <input
              id="tagline"
              placeholder="Optional"
              value={form.tagline}
              onChange={(event) => updateField('tagline', event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="values">Values</label>
            <textarea
              id="values"
              placeholder="Comma separated values"
              value={form.values}
              onChange={(event) => updateField('values', event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="audience">Audience</label>
            <textarea
              id="audience"
              placeholder="Audience descriptors"
              value={form.audience}
              onChange={(event) => updateField('audience', event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="competitors">Competitors</label>
            <textarea
              id="competitors"
              placeholder="URLs or competitor names"
              value={form.competitors}
              onChange={(event) => updateField('competitors', event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              placeholder="Internal research notes"
              value={form.notes}
              onChange={(event) => updateField('notes', event.target.value)}
            />
          </div>

          {error && <div style={{ color: '#fca5a5', fontWeight: 600 }}>{error}</div>}

          <div className="actions">
            <button type="submit" disabled={loading}>{loading ? 'Generating…' : 'Generate Palettes'}</button>
            <button type="button" onClick={() => { setForm(defaultForm); setPalettes([]); setSessionId(undefined); setStatus(''); setError(''); }}>
              Reset
            </button>
          </div>
        </form>
      </aside>

      <main className="content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Palette Options</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              type="button"
              className="palette-tab"
              style={{ borderRadius: 999, background: darkPreview ? '#0f172a' : '#e2e8f0', color: darkPreview ? '#f8fafc' : '#0f172a' }}
              onClick={() => setDarkPreview((prev) => !prev)}
            >
              {darkPreview ? 'Preview Light' : 'Preview Dark'}
            </button>
            {status && <span className="status-bar">{status}</span>}
          </div>
        </div>

        {palettes.length > 0 ? (
          <>
            <div className="palette-tabs">
              {palettes.map((palette, index) => (
                <button
                  key={palette.name}
                  type="button"
                  className={`palette-tab ${activeIndex === index ? 'active' : ''}`}
                  onClick={() => setActiveIndex(index)}
                >
                  Palette {String.fromCharCode(65 + index)}
                </button>
              ))}
            </div>

            {activePalette && (
              <div className="palette-layout">
                <div className="grid-card">
                  <header style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <h3 style={{ margin: 0 }}>{activePalette.name}</h3>
                    <span style={{ fontSize: '0.85rem', color: '#475569' }}>Seed trace: {activePalette.seedBack}</span>
                    <span style={{ fontSize: '0.85rem', color: '#475569' }}>Icon style: {activePalette.iconStyle}</span>
                  </header>
                  <SwatchStrip swatches={activePalette.swatches} />
                  <div className="roles-grid">
                    <RoleCard label="Primary" data={activePalette.roles.primary} />
                    <RoleCard label="Secondary" data={activePalette.roles.secondary} />
                    <RoleCard label="Accent" data={activePalette.roles.accent} />
                    <RoleCard label="Neutral" data={activePalette.roles.neutral} />
                    <RoleCard label="Background" data={activePalette.roles.background} />
                  </div>
                </div>

                <div className="grid-card">
                  <PreviewPanel palette={activePalette} darkPreview={darkPreview} />
                  <TypographyPanel palette={activePalette} />
                  <div>
                    <h3 style={{ marginBottom: 12 }}>Imagery Direction</h3>
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {activePalette.imagery.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 style={{ marginBottom: 12 }}>Logo Concept Prompts</h3>
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {activePalette.logoPrompts.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <ExportActions
                    palette={activePalette}
                    sessionId={sessionId}
                    paletteIndex={activeIndex}
                    onDownload={downloadZip}
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="grid-card" style={{ minHeight: 320, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <p>Fill out the form to generate palettes. Accessible contrast, color blindness safety, and deterministic seeding come standard.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

export interface ColorRole {
  role: string;
  hex: string;
  rgb: [number, number, number];
  hsl: [number, number, number];
  luminance: number;
  textOn: 'light' | 'dark';
  contrastOnText: number;
  usage?: string;
}

export interface Palette {
  name: string;
  roles: Record<'primary' | 'secondary' | 'accent' | 'neutral' | 'background', ColorRole>;
  swatches: ColorRole[];
  previews: {
    button: { background: string; text: string; contrast: number };
    buttonAlt: { background: string; text: string; contrast: number };
    heading: { color: string; background: string; contrast: number };
    card: { background: string; border: string; text: string };
  };
  typography: {
    headline: string;
    headlineWeights: number[];
    body: string;
    bodyWeights: number[];
    links: string[];
    pairs: Array<{
      headline: string;
      headlineWeights: number[];
      body: string;
      bodyWeights: number[];
      importUrl: string;
    }>;
    fallback: string;
  };
  iconStyle: string;
  imagery: string[];
  logoPrompts: string[];
  seedBack: number;
}

export interface GenerateResponse {
  sessionId: string;
  input: {
    industry: string;
    brandTone?: string;
    themePreference?: string;
    seed: number;
    useBusinessContext: boolean;
  };
  palettes: Palette[];
}

export type ThemePreference = 'light-first' | 'dark-first' | 'neutral-first' | '';

export interface FormState {
  industry: string;
  brandTone: string;
  businessName: string;
  tagline: string;
  values: string;
  audience: string;
  competitors: string;
  notes: string;
  randomSeed: string;
  themePreference: ThemePreference;
  useBusinessContext: boolean;
}

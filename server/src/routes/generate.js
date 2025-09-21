import { Router } from 'express';
import { z } from 'zod';
import { generatePalettes } from '../palette/engine.js';
import { saveSession } from '../storage/sessionStore.js';
import { resolveIndustry, listIndustries } from '../palette/industryMap.js';
import { normalizeSeed } from '../utils/random.js';

const router = Router();

const InputSchema = z.object({
  industry: z.string().min(2, 'Industry is required'),
  brandTone: z.string().optional(),
  businessName: z.string().max(120).optional(),
  tagline: z.string().max(220).optional(),
  values: z.string().max(600).optional(),
  audience: z.string().max(600).optional(),
  competitors: z.string().max(600).optional(),
  notes: z.string().max(1000).optional(),
  randomSeed: z.union([z.number(), z.string()]).optional(),
  themePreference: z.string().optional(),
  useBusinessContext: z.boolean().optional()
});

router.get('/industries', (_req, res) => {
  res.json({ industries: listIndustries() });
});

router.post('/', async (req, res) => {
  const parseResult = InputSchema.safeParse(req.body ?? {});
  if (!parseResult.success) {
    return res.status(422).json({
      error: 'Invalid input',
      details: parseResult.error.flatten()
    });
  }

  const {
    industry,
    brandTone,
    businessName,
    tagline,
    values,
    audience,
    competitors,
    notes,
    randomSeed,
    themePreference,
    useBusinessContext
  } = parseResult.data;

  const seed = normalizeSeed(randomSeed ?? industry.length * 131);
  const contextEnabled = Boolean(useBusinessContext);
  const contextData = contextEnabled
    ? { businessName, tagline, values, audience, competitors, notes }
    : null;

  const resolvedIndustry = resolveIndustry(industry);

  const palettes = generatePalettes({
    industry: resolvedIndustry,
    brandTone,
    themePreference,
    seed,
    contextEnabled,
    contextData
  });

  const session = await saveSession({
    input: {
      industry: resolvedIndustry,
      brandTone,
      themePreference,
      seed,
      useBusinessContext: contextEnabled
    },
    palettes
  });

  return res.json({
    sessionId: session.id,
    input: session.input,
    palettes: session.palettes
  });
});

export default router;

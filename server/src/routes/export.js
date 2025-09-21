import { Router } from 'express';
import { loadSession } from '../storage/sessionStore.js';
import { buildZipStream } from '../exporter/templates.js';

const router = Router();

router.get('/', async (req, res) => {
  const { sessionId, paletteIndex = '0' } = req.query;
  if (!sessionId) {
    return res.status(400).json({ error: 'sessionId is required' });
  }

  const session = await loadSession(sessionId);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const index = Number.parseInt(paletteIndex, 10);
  if (Number.isNaN(index) || index < 0 || index >= session.palettes.length) {
    return res.status(400).json({ error: 'Invalid palette index' });
  }

  const palette = session.palettes[index];
  const filename = `${palette.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'palette'}-brand-package.zip`;

  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  buildZipStream(res, palette, {
    sessionId,
    paletteIndex: index,
    input: session.input
  });
});

export default router;

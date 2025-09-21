import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import generateRouter from './routes/generate.js';
import exportRouter from './routes/export.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.use('/api/generate', generateRouter);
app.use('/api/export', exportRouter);

const publicDir = path.resolve(__dirname, '../public');
app.use(express.static(publicDir));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Branding Package Generator server running on port ${PORT}`);
});

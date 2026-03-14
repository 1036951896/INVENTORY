import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// CSS de /public (sin hash) nunca se cachea
app.use('/css', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  next();
});

// Assets de Vite con hash se cachean normalmente
app.use(express.static(join(__dirname, 'dist'), {
  maxAge: '1d',
  etag: false
}));

// index.html y SPA fallback nunca se cachean
app.use((req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Frontend servido en http://0.0.0.0:${PORT}`);
});

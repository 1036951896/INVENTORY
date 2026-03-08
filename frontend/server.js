import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Servir archivos estáticos desde dist
app.use(express.static(join(__dirname, 'dist'), {
  maxAge: '1d',
  etag: false
}));

// SPA Fallback - redirigir todas las rutas desconocidas a index.html
app.use((req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Frontend servido en http://localhost:${PORT}`);
});

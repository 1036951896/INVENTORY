import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Servir archivos estáticos desde dist
app.use(express.static(join(__dirname, 'dist')));

// Redirigir todas las rutas a index.html (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Frontend servido en puerto ${PORT}`);
});

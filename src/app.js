import express from 'express';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';

const app = express();
const PORT = 8080;

app.use(express.json());

// Rutas de productos y carritos
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

// raíz ("/")
app.get('/', (req, res) => {
  res.send('¡Bienvenido a mi aplicación Express!');
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  console.log('Hola');
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Servidor Express iniciado en http://localhost:${PORT}/`);
});

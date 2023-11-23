import express from 'express';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';

const app = express();
const PORT = 8080;

app.use(express.json());

app.use('/products', productRoutes);
app.use('/api/carts', cartRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});

app.listen(PORT, () => {
  console.log(`Servidor Express iniciado en http://localhost:${PORT}/products`);
});
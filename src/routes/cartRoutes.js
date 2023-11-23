import express from 'express';
import cartService from '../services/cartService.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const newCart = await cartService.createCart();
    res.json({ message: 'Nuevo carrito creado con éxito.', cart: newCart });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el carrito.' });
  }
});



export default router;

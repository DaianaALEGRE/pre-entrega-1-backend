import express from 'express';
import { getProducts, addProduct, getProductById, updateProduct, deleteProduct } from '../controllers/productController.js';

// Crear el router
const router = express.Router();

// Definir rutas
router.get('/', getProducts);
router.post('/', addProduct);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

// Exportar el router
export default router;
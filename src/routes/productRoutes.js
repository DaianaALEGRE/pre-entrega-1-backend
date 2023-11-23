import express from 'express';
import {
    getProducts,
    addProduct,
    getProductById,
    updateProduct,
    deleteProduct
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);
router.post('/', addProduct);
router.get('/:pid', getProductById);
router.put('/:pid', updateProduct);
router.delete('/:pid', deleteProduct);

// Exportar el router
export default router;

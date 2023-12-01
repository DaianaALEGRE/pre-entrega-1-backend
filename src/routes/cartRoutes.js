import express from 'express';
import {createCart,
  getCartItems,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartTotal,
  checkout,
} from '../controllers/cartController.js';

const router = express.Router();
router.post('/', createCart);
router.get('/:cid', getCartItems);
router.post('/:cid/product/:pid', addToCart);
router.put('/:cid/product/:pid', updateCartItem);
router.delete('/:cid/product/:pid', removeFromCart);
router.delete('/:cid/clear-cart', clearCart);
router.get('/:cid/total', getCartTotal);
router.post('/:cid/checkout', checkout);

export default router;

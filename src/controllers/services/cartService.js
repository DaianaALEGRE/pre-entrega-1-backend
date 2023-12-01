// CartService.js
import { readFile, writeFile } from '../utils/fileUtils.js';
import productService from './productService.js';

const CARTS_FILE_PATH = './data/carts.json';

class CartService {
  constructor() {
    this.carts = [];
    this.nextCid = 1;
    this.loadingPromise = this.loadCarts();
  }

  async loadCarts() {
    try {
      const data = await readFile(CARTS_FILE_PATH);
      this.carts = JSON.parse(data);
      this.nextCid = this.carts.length > 0 ? Math.max(...this.carts.map(c => c.id)) + 1 : 1;
    } catch (error) {
      console.error('Error al cargar carrito:', error.message);
      throw error;
    }
  }

  async saveCarts() {
    const data = JSON.stringify(this.carts, null, 2);
    try {
      await writeFile(CARTS_FILE_PATH, data);
    } catch (error) {
      console.error('Error al guardar carritos:', error.message);
      throw error;
    }
  }

  createCart() {
    const newCart = {
      id: this.nextCid++,
      products: []
    };

    this.carts.push(newCart);
    this.saveCarts();

    return newCart;
  }

  getCart(cid) {
    const numericCID = parseInt(cid, 10);
    const cart = this.carts.find(c => c.id === numericCID);

    if (!cart) {
      throw new Error('Carrito no encontrado.');
    }

    return cart;
  }

  getCartItems(cid) {
    const cart = this.getCart(cid);
    return cart.products.map(item => ({ productId: item.productId, quantity: item.quantity }));
  }

  addToCart(cid, productId, quantity) {
    const cart = this.getCart(cid);

    if (quantity <= 0) {
      throw new Error('La cantidad debe ser mayor que cero.');
    }

    const existingProduct = cart.products.find(p => p.productId === productId);

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }

    this.saveCarts();
  }

  updateCartItem(cid, productId, quantity) {
    const cart = this.getCart(cid);

    if (quantity <= 0) {
      throw new Error('La cantidad debe ser mayor que cero.');
    }

    const existingProduct = cart.products.find(p => p.productId === productId);

    if (existingProduct) {
      existingProduct.quantity = quantity;
      this.saveCarts();
    } else {
      throw new Error('Producto no encontrado en el carrito.');
    }
  }

  removeFromCart(cid, productId) {
    const cart = this.getCart(cid);
    const productIndex = cart.products.findIndex(p => p.productId === productId);

    if (productIndex !== -1) {
      cart.products.splice(productIndex, 1);
      this.saveCarts();
    } else {
      throw new Error('Producto no encontrado en el carrito.');
    }
  }

  clearCart(cid) {
    const cart = this.getCart(cid);
    cart.products = [];
    this.saveCarts();
  }

  calculateTotal(cid) {
    const cart = this.getCart(cid);

    if (cart.products.length === 0) {
      return 0;
    }

    let total = 0;

    for (const cartItem of cart.products) {
      const product = productService.getProductById(cartItem.productId);
      if (product) {
        total += product.price * cartItem.quantity;
      }
    }

    return total;
  }

  checkout(cid) {
    const cart = this.getCart(cid);

    if (cart.products.length === 0) {
      throw new Error('El carrito está vacío. No se puede realizar el pago.');
    }

    for (const cartItem of cart.products) {
      productService.reduceProductStock(cartItem.productId, cartItem.quantity);
    }

    this.clearCart(cid);

    return { message: 'Compra realizada con éxito.' };
  }
}

export default new CartService();

import { readFile, writeFile } from '../utils/fileUtils.js';
import ProductService from './productService.js';

const CARTS_FILE_PATH = './data/carts.json';

class CartService {
  constructor() {
    this.carts = [];
    this.nextCartId = 1;
    this.loadingPromise = this.loadCarts();
  }

  async loadCarts() {
    try {
      const data = await readFile(CARTS_FILE_PATH);
      this.carts = JSON.parse(data);
      this.nextCartId = this.carts.length > 0 ? Math.max(...this.carts.map(c => c.id)) + 1 : 1;
    } catch (error) {
      console.log('Error al cargar carritos:', error.message);
      throw error;
    }
  }

  async saveCarts() {
    const data = JSON.stringify(this.carts, null, 2);
    try {
      await writeFile(CARTS_FILE_PATH, data);
    } catch (error) {
      console.log('Error al guardar carritos:', error.message);
      throw error;
    }
  }

  getCart(cartId) {
    const cart = this.carts.find((c) => c.id === cartId);
    if (!cart) {
      throw new Error('Carrito no encontrado.');
    }
    return cart;
  }

  getCartItems(cartId) {
    const cart = this.getCart(cartId);
    return cart.products;
  }

  addToCart(cartId, productId, quantity) {
    const cart = this.getCart(cartId);

    if (quantity <= 0) {
      throw new Error('La cantidad debe ser mayor que cero.');
    }

    const existingProductIndex = cart.products.findIndex((p) => p.productId === productId);

    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }

    this.saveCarts();
  }

  updateCartItem(cartId, productId, quantity) {
    const cart = this.getCart(cartId);

    if (quantity <= 0) {
      throw new Error('La cantidad debe ser mayor que cero.');
    }

    const existingProductIndex = cart.products.findIndex((p) => p.productId === productId);

    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity = quantity;
      this.saveCarts();
    } else {
      throw new Error('Producto no encontrado en el carrito.');
    }
  }

  removeFromCart(cartId, productId) {
    const cart = this.getCart(cartId);

    const existingProductIndex = cart.products.findIndex((p) => p.productId === productId);

    if (existingProductIndex !== -1) {
      cart.products.splice(existingProductIndex, 1);
      this.saveCarts();
    } else {
      throw new Error('Producto no encontrado en el carrito.');
    }
  }

  clearCart(cartId) {
    const cart = this.getCart(cartId);
    cart.products = [];
    this.saveCarts();
  }

  calculateTotal(cartId) {
    const cart = this.getCart(cartId);

    if (cart.products.length === 0) {
      return 0;
    }

    let total = 0;

    for (const cartItem of cart.products) {
      const product = ProductService.getProductById(cartItem.productId);
      if (product) {
        total += product.price * cartItem.quantity;
      }
    }

    return total;
  }

  checkout(cartId) {
    const cart = this.getCart(cartId);

    if (cart.products.length === 0) {
      throw new Error('El carrito está vacío. No se puede realizar el pago.');
    }

    // falta logica de compra y pago finalizado

    for (const cartItem of cart.products) {
      ProductService.reduceProductStock(cartItem.productId, cartItem.quantity);
    }

    this.clearCart(cartId);

    return { message: 'Compra realizada con éxito.' };
  }
}

export default new CartService();



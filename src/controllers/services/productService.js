import { readFile, writeFile } from '../utils/fileUtils.js';

const PRODUCTS_FILE_PATH = './data/product.json';

class ProductService {
  constructor() {
    this.products = [];
    this.nextProductId = 1;
    this.loadingPromise = this.loadProducts();
  }

  async loadProducts() {
    try {
      const data = await readFile(PRODUCTS_FILE_PATH);
      this.products = JSON.parse(data);
      this.nextProductId = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
    } catch (error) {
      console.log('Error al cargar productos:', error.message);
      throw error;
    }
  }

  async saveProducts() {
    const data = JSON.stringify(this.products, null, 2);
    try {
      await writeFile(PRODUCTS_FILE_PATH, data);
    } catch (error) {
      console.log('Error al guardar productos:', error.message);
      throw error;
    }
  }

  getProductById(productId) {
    const product = this.products.find((p) => p.id === productId);
    if (!product) {
      throw new Error('Producto no encontrado.');
    }
    return product;
  }

  getProductStock(productId) {
    const product = this.getProductById(productId);
    return product.stock;
  }

  reduceProductStock(productId, quantity) {
    const product = this.getProductById(productId);

    if (product.stock < quantity) {
      throw new Error('Cantidad solicitada mayor que el stock disponible.');
    }

    product.stock -= quantity;
    this.saveProducts();
  }

  addProduct(product) {
    const { title, description, price, thumbnail, code, stock } = product;

    if (!title || !description || !price || !thumbnail || !code || !stock) {
      throw new Error('Todos los campos son obligatorios.');
    }

    if (this.products.some((p) => p.code === code)) {
      throw new Error('Ya existe un producto con el mismo código.');
    }

    const newProduct = {
      id: this.nextProductId,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this.nextProductId++;
    this.products.push(newProduct);
    this.saveProducts().catch((error) => {
      console.log('Error al guardar el nuevo producto:', error.message);
    });
  }

  updateProduct(id, updatedFields) {
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      throw new Error('Producto no encontrado.');
    }

    const productToUpdate = this.products[productIndex];
    Object.assign(productToUpdate, updatedFields);
    this.saveProducts().catch((error) => {
      console.log('Error al actualizar el producto:', error.message);
    });
  }

  deleteProduct(id) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error('Producto no encontrado.');
    }

    this.products.splice(index, 1);
    this.saveProducts().catch((error) => {
      console.log('Error al eliminar el producto:', error.message);
    });
  }
}

export default new ProductService();

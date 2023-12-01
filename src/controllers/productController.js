import productService from './services/productService.js';

export const getProducts = async (req, res) => {
  try {
    const limit = req.query.limit;
    const products = await productService.getProducts();

    if (limit) {
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Error al obtener productos.' });
  }
};

export const addProduct = async (req, res) => {
  try {
    const product = req.body;
    const newProduct = productService.addProduct(product);

    if (newProduct?.error) {
      res.status(400).json({ error: newProduct.error });
      return;
    }

    res.status(201).json({ message: 'Producto agregado con éxito.', product: newProduct });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = productService.getProductById(productId);

    res.json(product);
  } catch (error) {
    console.error(error.message);
    res.status(404).json({ error: 'Producto no encontrado.' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const updatedFields = req.body;

    const result = productService.updateProduct(productId, updatedFields);
    if (result?.error) {
      res.status(500).json({ error: result.error });
      return;
    }

    res.json({ message: 'Producto actualizado con éxito.' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Error al actualizar el producto.' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const result = productService.deleteProduct(productId);

    if (result?.error) {
      res.status(500).json({ error: result.error });
      return;
    }

    res.json({ message: 'Producto eliminado con éxito.' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Error al eliminar el producto.' });
  }
};

import productService from './services/productService.js';

export const getProducts = async (req, res) => {
  try {
    const limit = req.query.limit;
    const products = await productService.getProducts();

    console.log('produc', products)
    if (limit) {
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos.' });
  }
};
export const addProduct = (req, res) => {
  try {
    const product = req.body;
    productService.addProduct(product);
    res.json({ message: 'Producto agregado con éxito.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el producto.' });
  }
};
export const getProductById = (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = productService.getProductById(productId);
    console.log('prod', product)
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto.' });
  }
};

export const updateProduct = (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const updatedFields = req.body;
    productService.updateProduct(productId, updatedFields);
    res.json({ message: 'Producto actualizado con éxito.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto.' });
  }
};

export const deleteProduct = (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    productService.deleteProduct(productId);
    res.json({ message: 'Producto eliminado con éxito.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto.' });
  }
};

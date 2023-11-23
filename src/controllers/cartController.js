import cartService from './services/cartService.js';
import productService from './services/productService.js';


export const getCartItems = (req, res) => {
    try {
        const cid = req.params.cid;
        const cartItems = cartService.getCartItems(cid);
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos del carrito.' });
    }
}


export const addToCart = (req, res) => {
    try {
        const cid = req.params.cid;
        const { productId, quantity } = req.body;

        const product = productService.getProductById(productId);

        if (!product) {
            res.status(404).json({ error: 'Producto no encontrado.' });
            return;
        }

        cartService.addToCart(cid, productId, quantity);

        res.json({ message: 'Producto agregado al carrito con éxito.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto al carrito.' });
    }
};

export const updateCartItem = (req, res) => {
    try {
        const cid = req.params.cid;
        const { productId, quantity } = req.body;

        cartService.updateCartItem(cid, productId, quantity);

        res.json({ message: 'Cantidad de producto en el carrito actualizada con éxito.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la cantidad del producto en el carrito.' });
    }
}

export const removeFromCart = (req, res) => {
    try {
        const cid = req.params.cid;
        const productId = req.params.productId;

        cartService.removeFromCart(cid, productId);

        res.json({ message: 'Producto eliminado del carrito con éxito.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto del carrito.' });
    }
}

export const clearCart = (req, res) => {
    try {
        const cid = req.params.cid;

        cartService.clearCart(cid);

        res.json({ message: 'Carrito vaciado con éxito.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al vaciar el carrito.' });
    }
}

export const getCartTotal = (req, res) => {
    try {
        const cid = req.params.cid;
        const total = cartService.calculateTotal(cid);

        res.json({ total });
    } catch (error) {
        res.status(500).json({ error: 'Error al calcular el total del carrito.' });
    }
}

export const checkout = (req, res) => {
    try {
        const cid = req.params.cid;

        const result = cartService.checkout(cid);

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error al realizar el pago y finalizar la compra.' });
    }
}



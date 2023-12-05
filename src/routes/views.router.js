import express from "express";
import { socketServer } from "../app.js";
import productService from "../controllers/services/productService.js";
import {deleteProduct} from "../controllers/productController.js";

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const users = [];

router.get('/', async (req, res) => {
  const products = await productService.getProducts();
  res.render('home', {
    style: 'index.css',
    products,
  });
});

router.get('/add-products', (req, res) => {
  res.render('addProducts', {
    style: 'index.css',
  })
})

router.get('/realTimeProducts', async (req, res) => {
  const products = await productService.getProducts();

  res.render('realTimeProducts', {
    style: 'index.css',
    products
  })
})

router.post('/add-products', (req, res) => {
  const { title, description, price, thumbnail, stock } = req.body;
  function generateUniqueCode() {
    const timestamp = new Date().getTime();
    const randomValue = Math.floor(Math.random() * 1000);
    return `${timestamp}-${randomValue}`;
  }
  const product = {
    title,
    description,
    price,
    thumbnail,
    stock,
    code: generateUniqueCode(),
  };
  const result = productService.addProduct(product);

  if (result.error) {
    res.render('addProducts', {
      style: 'index.css',
      error: result.error,
    });
  } else {
    socketServer.emit('productAdded', product);
    console.log('Producto agregado:', product);
    res.render('addProducts', {
      style: 'index.css',
      success: true,
    });
  }
});

router.delete('/delete-product/:pid',deleteProduct)

router.get('/register', (req, res) => {
  res.render('register', {
    style: 'index.css'
  })
})

router.post('/user', (req, res) => {
  const { name, email, password } = req.body;

  const user = {
    name,
    email,
    password
  };

  users.push(user);
  console.log(user)
  res.render('register', {
    success: true,
    user: user,
    style: 'index.css'
  });
});

export default router;
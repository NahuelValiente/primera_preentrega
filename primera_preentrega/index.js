const express = require('express');
const app = express();
const PORT = 8080;

app.use(express.json());

// Router de productos
const productsRouter = express.Router();

// Lista de productos (simulada)
let products = [];

// Obtener todos los productos
productsRouter.get('/', (req, res) => {
  res.json(products);
});

// Obtener un producto por ID
productsRouter.get('/:pid', (req, res) => {
  const productId = req.params.pid;
  const product = products.find((p) => p.id === productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
});

// Agregar un nuevo producto
productsRouter.post('/', (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  } = req.body;

  const newProduct = {
    id: generateId(),
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  };

  products.push(newProduct);

  res.status(201).json(newProduct);
});

// Actualizar un producto por ID
productsRouter.put('/:pid', (req, res) => {
  const productId = req.params.pid;
  const updatedProduct = req.body;

  const index = products.findIndex((p) => p.id === productId);
  if (index !== -1) {
    // Mantener el ID original del producto
    updatedProduct.id = productId;

    products[index] = updatedProduct;

    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
});

// Eliminar un producto por ID
productsRouter.delete('/:pid', (req, res) => {
  const productId = req.params.pid;

  products = products.filter((p) => p.id !== productId);

  res.sendStatus(204);
});

app.use('/api/products', productsRouter);

// Router de carritos
const cartsRouter = express.Router();

// Lista de carritos (simulada)
let carts = [];

// Obtener los productos de un carrito por ID
cartsRouter.get('/:cid', (req, res) => {
  const cartId = req.params.cid;
  const cart = carts.find((c) => c.id === cartId);
  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).json({ message: 'Carrito no encontrado' });
  }
});

// Agregar un producto al carrito
cartsRouter.post('/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  const cart = carts.find((c) => c.id === cartId);
  if (cart) {
    const existingProduct = cart.products.find((p) => p.product === productId);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    res.json(cart.products);
  } else {
    res.status(404).json({ message: 'Carrito no encontrado' });
  }
});

// Crear un nuevo carrito
cartsRouter.post('/', (req, res) => {
  const newCart = {
    id: generateId(),
    products:[],
};

carts.push(newCart);

res.status(201).json(newCart);
});

app.use('/api/carts', cartsRouter);

// Generar ID único
function generateId() {
return Math.random().toString(36).substr(2, 9);
}

// Iniciar el servidor
app.listen(PORT, () => {
console.log('Servidor escuchando en el puerto ${PORT}');
});

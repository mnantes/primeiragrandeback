const express = require('express');
const fs = require('fs');
const router = express.Router();
const path = './data/carrito.json';

const readData = () => {
    const data = fs.readFileSync(path, 'utf-8');
    return JSON.parse(data);
};

const writeData = (data) => {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
};

router.post('/', (req, res) => {
    const carts = readData();
    const newCart = {
        id: `cart_${Date.now()}`,
        products: []
    };

    carts.push(newCart);
    writeData(carts);
    res.status(201).json(newCart);
});

router.get('/:cid', (req, res) => {
    const carts = readData();
    const cart = carts.find(c => c.id === req.params.cid);
    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }
    res.json(cart.products);
});

router.post('/:cid/product/:pid', (req, res) => {
    const carts = readData();
    const cart = carts.find(c => c.id === req.params.cid);
    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }

    const productIndex = cart.products.findIndex(p => p.product === req.params.pid);
    if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
    } else {
        cart.products.push({ product: req.params.pid, quantity: 1 });
    }

    writeData(carts);
    res.status(200).json(cart);
});

module.exports = router;

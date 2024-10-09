const express = require('express');
const fs = require('fs');
const router = express.Router();
const path = './data/produtos.json';

const readData = () => {
    const data = fs.readFileSync(path, 'utf-8');
    return JSON.parse(data);
};

const writeData = (data) => {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
};

router.get('/', (req, res) => {
    const { limit } = req.query;
    const products = readData();
    if (limit) {
        return res.json(products.slice(0, limit));
    }
    res.json(products);
});

router.get('/:pid', (req, res) => {
    const products = readData();
    const product = products.find(p => p.id === req.params.pid);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
});

router.post('/', (req, res) => {
    const products = readData();
    const newProduct = {
        id: `product_${Date.now()}`,
        ...req.body,
        status: req.body.status ?? true
    };

    products.push(newProduct);
    writeData(products);
    res.status(201).json(newProduct);
});

router.put('/:pid', (req, res) => {
    const products = readData();
    const index = products.findIndex(p => p.id === req.params.pid);
    if (index === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }

    products[index] = { ...products[index], ...req.body, id: products[index].id };
    writeData(products);
    res.json(products[index]);
});

router.delete('/:pid', (req, res) => {
    const products = readData();
    const filteredProducts = products.filter(p => p.id !== req.params.pid);
    writeData(filteredProducts);
    res.status(204).end();
});

module.exports = router;

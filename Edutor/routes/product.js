const express = require('express');
const router = express.Router();
const moment = require('moment');
const Cart = require('../models/Cart');
const Product = require('../models/Product');



router.get('/listProducts', (req, res) => {
    Product.findAll({
        order: [['price', 'DESC']],
        raw: true
    })
        .then((products) => {
            res.render('product/listProducts', { products });
        })
        .catch(err => console.log(err));
});

router.post('/add-to-cart', (req, res, next) => {
    const addedProduct = Product.name
    Cart.save(addedProduct);
    console.log(Cart.getCart());
    res.end('saved successfully')
});

router.get('/addProduct', (req, res) => {
    res.render('product/addProduct');
    });

router.post('/addProduct', (req, res) => {
    let name = req.body.name;
    let price = req.body.price;
    Product.create(
    { name, price }
    )
    .then((product) => {
    console.log(product.toJSON());
    res.redirect('/product/listProducts');
    })
    .catch(err => console.log(err))
    });
    
module.exports = router;

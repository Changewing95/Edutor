const express = require('express');
const router = express.Router();
const moment = require('moment');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const cartController = require('../Controller/cart');

router.get('/', (req,res,next) =>{
    const gettingCart = Cart.getCart();
    const gettingCartTotal = Cart.getCartTotal();
    const gettingCount = Cart.getCartCount();
    console.log(gettingCart);
    res.render('cart/cart', {cart: gettingCart, total: gettingCartTotal, Cartcount:gettingCount})
});

router.post('/addtoCart', cartController.addToCart);

router.post('/delete-cart', cartController.deleteCart);

module.exports = router;

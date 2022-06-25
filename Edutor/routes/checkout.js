const express = require('express');
const router = express.Router();
const moment = require('moment');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const OrderItems = require('../models/OrderItems');

router.get('/', (req, res) => {
	const gettingCart = Cart.getCart();
    const cartTotal =  Cart.getCartTotal();
    res.render('checkout/checkout', {cart: gettingCart, total:cartTotal})
});

router.post('/ordercreate', (req, res) => {
	let country = req.body.country;
    let paym = req.body.paym;
	let totalPrice = req.body.cartTotal;
    let userId = req.user.id;
    let prodId = req.product.id;
    console.log(country);
    Order.create(
        { paym, country,totalPrice, userId }
    )
        .then((order) => {
            console.log(order.toJSON());
            res.redirect('/orderSuccessful');
        })
        .catch(err => console.log(err))
    
    
});

router.get('/orderSuccessful', (req,res) => {
    res.render('checkout/orderSuccessful');

});


module.exports = router;

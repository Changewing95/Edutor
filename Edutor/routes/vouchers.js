const express = require('express');
const router = express.Router();
const Voucher = require('../models/Voucher');
const User = require('../models/User');


router.get('/', (req,res) =>{
    Voucher.findAll({
        where: { tutor_ID: req.user.id },
        raw: true
    })
        .then((cartitems) => {
            var cart = req.session.cart;
            var total = req.session.total;
            var cartCount = req.session.cartCount;
            res.render('cart/cart', { cartitems, cartCount: cartCount,total: total });
        })
        .catch(err => console.log(err));
    // res.render('cart/cart', {cart: cart, total: total, Cartcount:cartCount}) 
});

module.exports = router;
const express = require('express');
const router = express.Router();
// const User = require('../models/User')
const flashMessage = require('../helpers/messenger');

router.get('/cart', (req, res) => {
    res.render('cart/cart');
});


module.exports = router;

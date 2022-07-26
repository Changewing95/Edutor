const express = require('express');
const router = express.Router();

router.get('/orderSuccessful', (req,res) => {
    res.render('checkout/orderSucessful');
});

const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const User = require('../models/User');


router.get('/', (req,res,next) =>{

    res.render('coupon/vouchers')
});
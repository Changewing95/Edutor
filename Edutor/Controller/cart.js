const { json } = require('body-parser');
const { body, validationResult } = require('express-validator');
const flashMessage = require('../helpers/messenger');
const Product = require('../models/Product');
const Cart = require('../models/Cart');


exports.addToCart = async(req,res,next) => {
    addProduct = await Product.findOne({
        where: {
          id : req.body.id
        }
    }).then((Product)=>{
        Cart.save(Product);
        // console.log(Cart.getCart());
        res.redirect('/cart');
    })
}

exports.deleteCart = (req,res,next) => {
    console.log(req.body.prodId);
    Cart.delete(req.body.prodId);
    res.redirect('/cart');

}

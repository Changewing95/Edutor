const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const User = require('../models/User');

function isProductinCart(cart,id){
    for(let i=0; i<cart.length; i++){
        if(cart[i].id == id){
            return true;
        }
    }
}

function calculateTotal(cart,req){
    total=0;
    for(let i=0; i<cart.length; i++){
        total = total + (Number(cart[i].price));
    }
    req.session.total = total;
    return total;
}

function cartCount(cart,req){
    count=0;
    for(let i=0; i<cart.length; i++){
        count+=1;
    }
    req.session.cartCount = count;
    return count;
}


router.get('/', (req,res,next) =>{
 
    Cart.findAll({
        where: { student_ID: req.user.id },
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

// router.post('/addtoCart', cartController.addToCart);

router.post('/addtoCart', (req,res) => {
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var image = req.body.image;
    var author = req.body.author;
    var tutorid = req.body.tutorid;
    var current_student = req.user.id;

    // creating cart here
    var cart = req.session.cart;
    //use findOrCreate here later
    Cart.create(
        { student_ID: current_student, tutor_ID:tutorid, product_ID: id, product_name: title,  price: price, image: image, author:author}
    )
        .then((carts) => {

            console.log(carts.toJSON());
            res.redirect('/cart');
        })
        .catch(err => console.log(err))

    // end creating cart

    var addingProd = {id:id, title:title, author:author,price:price,image:image,tutorid:tutorid};

    if(req.session.cart){
        var cart = req.session.cart;

        if(!isProductinCart(cart,id)){
            cart.push(addingProd)
        }
    }else{
        req.session.cart = [addingProd];
        var cart = request.session.cart;
    }

    //calculate total
    calculateTotal(cart,req);
    cartCount(cart,req);

    // return to cart page
    res.redirect('/cart');

});


router.post('/delete-cart', (req,res) => {
    var id = req.body.productID;
    var cart = req.session.cart;

    Cart.destroy({
        where: {product_ID : id},
        raw: true
        }).then((destroyeditem) => {
            console.log(destroyeditem);
    });


    for(let i=0; i<cart.length; i++){
        if(cart[i].id == id){
            cart.splice(cart.indexOf(i));
        }
    }

    //recalculate
    calculateTotal(cart,req);
    cartCount(cart,req);
    res.redirect('/cart');
});

module.exports = router;

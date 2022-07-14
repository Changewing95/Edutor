const express = require('express');
const router = express.Router();

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
    var cart = req.session.cart;
    var total = req.session.total;
    var cartCount = req.session.cartCount;
    res.render('cart/cart', {cart: cart, total: total, Cartcount:cartCount})
});

// router.post('/addtoCart', cartController.addToCart);

router.post('/addtoCart', (req,res) => {
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var image = req.body.image;
    var author = req.body.author;
    var tutorid = req.body.tutorid;

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

    //return to cart page
    res.redirect('/cart');

});


router.post('/delete-cart', (req,res) => {
    var id = req.body.productID;
    var cart = req.session.cart;

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

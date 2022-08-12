const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const User = require('../models/User');

function isProductinCart(cart, id) {
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id == id) {
            return true;
        }
    }
}

function calculateTotal(cart, req) {
    total = 0;
    for (let i = 0; i < cart.length; i++) {
        total = total + (Number(cart[i].price));
    }
    req.session.total = total;
    return total;
}

function cartCount(cart, req) {
    count = 0;
    for (let i = 0; i < cart.length; i++) {
        count += 1;
    }
    req.session.cartCount = count;
    return count;
}


router.get('/', async (req, res, next) => {
    // req.session.destroy()
    await Cart.findAll({
        where: { student_ID: req.user.id },
        raw: true
    })
        .then((cartitems) => {
            Cart.count({ //updated cart count 
                where: { student_ID: req.user.id },
                raw: true
            })
                .then((cartCount) => {
                    Cart.sum('price', { //updated cart count 
                        where: { student_ID: req.user.id },
                        raw: true
                    })
                        .then((cartTotal) => {
                            res.render('cart/cart', { cartitems, cartCount, cartTotal });
                        })
                        .catch(err => console.log(err));
                    // res.render('cart/cart', {cart: cart, total: total, Cartcount:cartCount})
                });
        });
});

// router.post('/addtoCart', cartController.addToCart);

router.post('/addtoCart', (req, res) => {
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var image = req.body.image;
    var author = req.body.author;
    var tutorid = req.body.tutorid;
    var current_student = req.user.id;
    var prodType = req.body.productType;
    var product_item = req.body.product_item


    Cart.findOrCreate({
        where: { student_ID: current_student, tutor_ID: tutorid, product_ID: id, product_name: title, price: price, image: image, author: author, product_type: prodType, product_item: product_item }
    })

    var addingProd = { id: id, title: title, author: author, price: price, image: image, tutorid: tutorid, product_item: product_item, prodType: prodType };

    if (req.session.cart) {
        var cart = req.session.cart;

        if (!isProductinCart(cart, id)) {
            cart.push(addingProd)
        }
    } else {
        req.session.cart = [addingProd];
        var cart = req.session.cart;
    }

    //calculate total
    calculateTotal(cart, req);
    cartCount(cart, req);

    // return to cart page
    res.redirect('/cart');

});


router.post('/delete-cart', (req, res) => {
    var id = req.body.productID;
    var cart = req.session.cart;

    Cart.destroy({
        where: { product_ID: id },
        raw: true
    }).then((destroyeditem) => {
        console.log(destroyeditem);
    });


    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id == id) {
            cart.splice(cart.indexOf(i));
        }
    }

    //recalculate
    calculateTotal(cart, req);
    cartCount(cart, req);
    res.redirect('/cart');
});

module.exports = router;

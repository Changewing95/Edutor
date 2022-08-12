const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const OrderItems = require('../models/OrderItems');
const User = require('../models/User');
const Tutorial = require('../models/Tutorial');
const Cart = require('../models/Cart');
const stripe = require('stripe')("Add your secret key");

router.get('/', (req, res) => {
    Order.findAll({
        limit: 1,
        order: [['createdAt', 'DESC']]
    })
        .then((orders) => {
            Cart.findAll({
                where: { student_ID: req.user.id },
                raw: true
            }).then((cartitems) => {
                Cart.sum('price', { //updated cart count 
                    where: { student_ID: req.user.id },
                    raw: true
                })
                    .then((total) => {
                        res.render('checkout/checkout', { cartitems, total, orders });
                    })
            })
        })
        .catch(err => console.log(err));
});

router.post('/place_order', (req, res) => {
    //Order creation
    var country = req.body.country;
    var paym = req.body.paym;
    var totalPrice = req.session.total;
    var userId = req.user.id;
    var products_ids = "";
    var oid = req.body.oid;
    var cust_name = req.body.cust_name;

    console.log("new order id " + oid);
    //Order items creation
    var cart = req.session.cart;
    for (let i = 0; i < cart.length; i++) {
        products_ids = products_ids + "," + cart[i].id;
    }
    Order.create(
        { order_id: oid, paym, country, totalPrice, products_ids, userId }
    )
        .then((order) => {
            console.log(order.toJSON());
        })
        .catch(err => console.log(err))

    for (let i = 0; i < cart.length; i++) {
        var prod_name = cart[i].title;
        var price = cart[i].price;
        var tutorid = cart[i].tutorid; //id of tutor who created each product
        var prod_item = cart[i].product_item;
        var prodType = cart[i].prodType;
        var qty = 1;
        var cust_name = req.body.cust_name;
        var cust_id = req.user.id;
        var status = "ok";

        OrderItems.create(
            { orderId: oid, cust_name: cust_name, cust_id: cust_id, tutor_id: tutorid, prod_name: prod_name, prodType: prodType, qty: qty, status: status, price: price, item_detail: prod_item }
        )
            .then((orderitem) => {
                console.log(orderitem.toJSON());
                res.redirect('/checkout/orderSuccessful');
            })
            .catch(err => console.log(err))
    }

    Cart.destroy({
        where: { student_ID: req.user.id },
        raw: true
    }).then((destroyeditem) => {
        console.log(destroyeditem);
    });


});



router.get('/orderSuccessful', (req, res) => {
    Order.findOne({
        limit: 1,
        where: {
            userId: req.user.id
        },
        order: [['createdAt', 'DESC']]
    })
        .then((order) => {
            OrderItems.findAll({
                where: { cust_id: req.user.id, orderId: order.order_id },
                raw: true
            })
                .then((cartitems) => {
                    console.log(order)
                    res.render('checkout/orderSuccessful', { cartitems, order });
                })
        })
        .catch(err => console.log(err));
});


module.exports = router;

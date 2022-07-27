const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const OrderItems = require('../models/OrderItems');
const User = require('../models/User');
const Tutorial = require('../models/Tutorial');



router.get('/', (req, res) => {
    Order.findAll({
        limit: 1,
        order: [['createdAt', 'DESC']]
    })
        .then((orders) => {
            // pass object to listVideos.handlebar
            console.log(orders);
            var total = req.session.total;
            var cart = req.session.cart;
            res.render('checkout/checkout', { cart: cart, total: total, orders });
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
        var qty = 1;
        var cust_name = req.user.name;
        var status = "ok";

        OrderItems.create(
            { orderId: oid, cust_name: cust_name, tutor_id: tutorid, prod_name: prod_name, qty: qty, status: status, price: price }
        )
            .then((orderitem) => {
                console.log(orderitem.toJSON());
                res.redirect('/checkout/orderSuccessful');
            })
            .catch(err => console.log(err))
    }

});

router.get('/orderSuccessful', (req, res) => {
    Order.findAll({
        limit: 1,
        where: {
            userId: req.user.id
        },
        order: [['createdAt', 'DESC']]
    })
        .then((orders) => {
            // pass object to listVideos.handlebar
            console.log(orders);
            res.render('checkout/orderSuccessful', { orders });
        })
        .catch(err => console.log(err));
});


module.exports = router;

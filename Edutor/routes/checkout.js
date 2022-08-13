const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const OrderItems = require('../models/OrderItems');
const User = require('../models/User');
const Tutorial = require('../models/Tutorial');
const Cart = require('../models/Cart');
// for raw sql
const db = require('../config/DBConfig');
const { QueryTypes } = require('sequelize');



router.get('/', (req, res) => {
    Order.findAll({
        limit: 1,
        order: [['createdAt', 'DESC']]
    })
        .then((orders) => {
            Cart.findAll({
                where: { student_ID: req.user.id },
                raw: true
            })
                .then((cartitems) => {
                    var total = req.session.total;
                    res.render('checkout/checkout', { cartitems, total: total, orders });
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
        console.log(prodType)
        OrderItems.create(
            { cust_name: cust_name, cust_id: cust_id, tutor_id: tutorid, prod_name: prod_name, prodType: prodType, qty: qty, status: status, price: price, item_detail: prod_item, order_id: oid }
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

router.get('/orderSuccessful', async (req, res) => {
    await Order.findOne({
        where: {
            userId: req.user.id
        },
        order: [['createdAt', 'DESC']]
    })
        .then((theordermade) => {
            OrderItems.findAll({
                where: {
                    cust_id: req.user.id,
                    order_id: theordermade.order_id
                },
                raw: true
            })

                .then((orderItems) => {
                    console.log("latests order:" + theordermade.order_id)
                    res.render('checkout/orderSuccessful', { orderItems, theordermade });
                })
        })
        .catch(err => console.log(err));
});


module.exports = router;
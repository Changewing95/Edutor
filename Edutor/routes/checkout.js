const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const OrderItems = require('../models/OrderItems');
const User = require('../models/User');
const Tutorial = require('../models/Tutorial');
const Cart = require('../models/Cart');
const ensureAuthenticated = require('../helpers/checkAuthentication');

// for raw sql
const db = require('../config/DBConfig');
const { QueryTypes } = require('sequelize');

const paypal = require('paypal-rest-sdk');
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AUvIwVU7LwotRL4fgWsVhYQqSn6BWZeJeoi0KUIMvYsa8BgMD-tcldToEcjf6KIiFFcg4arRx0YKAmvA',
    'client_secret': 'ELPvlaeJkPAA3SULRitj3K06KJHckaTLNAZHcswzcjadTtzX0HeRG6KJPo3bCZ9U2R_IweJg9MuVX_uq'
});


router.get('/', ensureAuthenticated, (req, res) => {
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

router.post('/place_order', async (req, res) => {


    //Order creation
    var country = req.body.country;
    var paym = req.body.paym;
    var totalPrice = req.body.cartTotal;
    var userId = req.user.id;
    var products_ids = "";
    var oid = req.body.oid;

    //order creation
    Order.create(
        { order_id: oid, paym, country, totalPrice, products_ids, userId }
    )
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:5001/checkout/orderSuccessful",
            "cancel_url": "http://localhost:3000/checkout/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Red Sox Hat",
                    "sku": "001",
                    "price": "0.01",
                    "currency": "SGD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "SGD",
                "total": "0.01"
            },
            "description": "Hat for the best team ever"
        }]
    };


    //order items' creation
    await Cart.findAll({
        where: { student_ID: req.user.id },
        raw: true
    })
        .then((cartitems) => {
            for (const cartItem of cartitems) {
                const Purchasingprod = Cart.findAll({ where: { product_ID: cartItem.product_ID } })
                console.log("pp:" + Purchasingprod)

                var qty = 1;
                var customer_id = req.user.id;
                var status = "ok";
                OrderItems.create(
                    { cust_id: customer_id, tutor_name: cartItem.author, prod_id: cartItem.product_ID, tutor_id: cartItem.tutor_ID, prod_name: cartItem.product_name, prodType: cartItem.product_type, qty: qty, status: status, price: cartItem.price, item_detail: cartItem.product_item, order_id: oid }
                )
            }
            // res.redirect('/checkout/orderSuccessful');


        })





    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    res.redirect(payment.links[i].href);
                }
            }
        }
    });


});

router.get('/orderSuccessful', ensureAuthenticated, async (req, res) => {


    Cart.destroy({
        where: { student_ID: req.user.id },
        raw: true
    }).then((destroyeditem) => {
        console.log(destroyeditem);
    });

    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "SGD",
                "total": "0.01"
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log(JSON.stringify(payment));
            // res.send('Success');
        }
    });

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


router.get('/cancel', (req, res) => res.send('Cancelled'));

module.exports = router;

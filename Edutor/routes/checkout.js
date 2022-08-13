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
    var totalPrice = req.session.total;
    var userId = req.user.id;
    var products_ids = "";
    var oid = req.body.oid;

    //order creation
    Order.create(
        { order_id: oid, paym, country, totalPrice, products_ids, userId }
    )

    //order items' creation
    Cart.findAll({
        where: { student_ID: req.user.id },
        raw: true
    })
        .then((cartitems) => {
            for (const cartItem of cartitems) {
                const Purchasingprod = Cart.findAll({ where: { product_ID: cartItem.product_ID } })
                console.log(Purchasingprod)

                var qty = 1;
                var customer_id = req.user.id;
                var status = "ok";
                OrderItems.create(
                    { cust_id: customer_id, tutor_id: cartItem.tutor_ID, prod_name: cartItem.product_name, prodType: cartItem.product_type, qty: qty, status: status, price: cartItem.price, item_detail: cartItem.prod_item, order_id: oid }
                )
            }
            res.redirect('/checkout/orderSuccessful');

        })

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
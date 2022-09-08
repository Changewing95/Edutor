const express = require('express');
const ensureAuthenticated = require('../helpers/auth');
const router = express.Router();
// const moment = require('moment');
const Tutorial = require('../models/Tutorial');
// const fs = require('fs');
// const upload = require('../helpers/uploadImage');
const UserController = require('../Controller/User');
const procyon = require('procyon')
const OrderItems = require('../models/OrderItems');
const sequelize = require('sequelize');
const { response } = require('express');
const User = require('../models/User');
var md5 = require('md5');

//for raw sql
const db = require('../config/DBConfig');
const { QueryTypes } = require('sequelize');
const { NIL } = require('uuid');


router.get('/main', ensureAuthenticated, async (req, res) => {
    // let x = await UserController.Recommendation(req,res)
    // Tutorial.findAll({
    //     raw: true
    // }).then((tutorials) => {
    //         // pass object to listVideos.handlebar
    //         res.render('tutor/studentTutorial', { tutorials});
    //     })
    //     .catch(err => console.log(err));

    Tutorial.findAll({
        // where: { userId: req.user.id },
        raw: true
    })
        .then((tutorials) => {
            // pass object to listVideos.handlebar
            res.render('tutor/tutorial', { tutorials });
        })
        .catch(err => console.log(err));


    // let product = await db.query(`SELECT * FROM tutorials INNER JOIN orderItems ON tutorials.id=orderItems.prod_id WHERE orderItems.cust_id = '${req.user.id}'`, { type: QueryTypes.SELECT });
    // let productNotBought = await db.query(`SELECT * FROM tutorials LEFT JOIN orderItems ON tutorials.id=orderItems.prod_id`, { type: QueryTypes.SELECT });
    // // console.log(product);
    // productNotBought.forEach(product => {
    //     console.log(product)
    // });

    // console.log("not bought" + productNotBought);
    // // res.render('tutor/studentTutorial', { product: product, productNotBought: productNotBought })
    // res.render('tutor/studentTutorial', { productNotBought: productNotBought })
});


router.get('/getRecommendation', ensureAuthenticated, async (req, res) => {
    let x = await UserController.Recommendation(req, res)
    return res.json({
        x: x,
        hash: md5(JSON.stringify(x))

    })

});





router.get('/display/:id', (req, res) => {
    Tutorial.findByPk(req.params.id)
        .then((tutorials) => {
            res.render('tutor/studentDetailedTutorial', { tutorials });
        })
        .catch(err => console.log(err));
});

router.get('/watching-video/:id', (req, res) => {
    Tutorial.findByPk(req.params.id)
        .then((tutorialToWatch) => {
            res.render('student/watching_video', { tutorialToWatch });
        })
        .catch(err => console.log(err));
});


router.get('/get-video/:userId/:fileName', async (req, res) => {
    // res.sendFile(`uploads/${id}/${req.params.fileName}`, { root: 'public' })
    // await Tutorial.findByPk(req.params.fileName)
    //     let tut = await Tutorial.findByPk
    //     // .then((tutorials) => {
    //         console.log(tut)
    //         console.log(req.params.fileName)
    // res.sendFile(`uploads/${tutorials.userId}/${req.params.fileName}`, { root: 'public' })
    // .catch(err => console.log(err));
    console.log(req.params.userId);
    res.sendFile(`uploads/${req.params.userId}/${req.params.fileName}`, { root: 'public' })
})

module.exports = router;


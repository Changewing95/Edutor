const express = require('express');
const router = express.Router();
const flashMessage = require('../helpers/messenger');
const fetch = require('isomorphic-fetch')
const { stringify } = require('querystring');
const fs = require('fs');
const upload = require('../helpers/reviewImageUpload');
// models
const Review = require('../models/Review');
const moment = require('moment');

// const Order = require('../models/Order');
// const OrderItems = require('../models/OrderItems');

// for raw sql
const db = require('../config/DBConfig');
const { QueryTypes } = require('sequelize');


// for validation
const ensureAuthenticated = require('../helpers/auth');
const { Console } = require('console');

// function to checkdate endtime > current:
function checkEndTimeCurrentTime(array) {
    // verify if endtime is later than current (so that user can leave feedback)
    var consult_endtime = ((array[0].end_time).toString()).slice(16, 24);
    var consult_date = ((array[0].date).toString()).slice(4, 16);
    
    // concat both date and time together
    var consult_date_endtime = consult_date.concat(' ', consult_endtime);
    // create new date object
    var check = new Date(consult_date_endtime);

    // current datetime
    var today = moment();
    console.log(today.toString());

    return (check > today);

    // console.log(check > today);
}



// REVIEW
// for students
router.get('/main', ensureAuthenticated, (req, res) => {
    Review.findAll({
        where: { userId: req.user.id },
        order: [['createdAt']],
        raw: true
    })
        .then((reviews) => {
            // pass object to review.hbs
            res.render('review/review', { reviews });
        })
        .catch(err => console.log(err));
});

router.get('/choose', ensureAuthenticated, async (req, res) => {
    // sql query
    let product = await db.query(`SELECT prod_name, name, prodType
                                    FROM orderitems oi
                                    INNER JOIN users u
                                    ON u.id = oi.tutor_id
                                    `, { type: QueryTypes.SELECT });
    // console.log(product)
    res.render('review/choose', { orders: product });
});

router.get('/create/:prodType/:prodname', ensureAuthenticated, async (req, res) => {
    const productname = (req.params).prodname
    const prodType = req.params.prodType

    console.log(productname);
    console.log(prodType);
    if (prodType === 'consultation session') {
        let product = await db.query(`SELECT id, title, date, end_time
                                        FROM consultations
                                        WHERE title = '${productname}'
                                        `, { type: QueryTypes.SELECT });

        var checking = checkEndTimeCurrentTime(product);

        if (checking) {
            console.log('cannot leave review');
            flashMessage(res, 'error', "You can't leave review for " + productname + " yet! Wait until the designated end time of the " + prodType + " to end before doing so.");
            res.redirect('../../../review/choose');
        }
        else {
            console.log('can leave review');
            res.render('review/addReview', { product });
        }

    }
    else if (prodType === 'event') {
        let product = await db.query(`SELECT id, title, date, endtime 
                                        FROM event
                                        WHERE title = '${prodname}'`, { tupe: QueryTypes.SELECT });
        // todo: verify endtime for dylan
        res.render('review/addReview', { product })
    }
    else {
        let product = await db.query(`SELECT id, title
                                        FROM consultations
                                        WHERE title = '${productname}'
                                        `, { type: QueryTypes.SELECT });
        res.render('review/addReview', { product });
    }
});

router.get('/editReview/:id', ensureAuthenticated, (req, res) => {
    Review.findByPk(req.params.id)
        .then((review) => {
            if (!review) {
                flashMessage(res, 'error', 'Video not found');
                res.redirect('/student/review/main');
                return;
            }
            if (req.user.id != review.userId) {
                flashMessage(res, 'error', 'Unauthorised access');
                res.redirect('/student/review/main');
                return;
            }

            res.render('review/editReview', { review });
        })
        .catch(err => console.log(err));
});



// ROUTES (POST)
// CREATE
router.post('/create/:prodType/:prod_num', ensureAuthenticated, async (req, res) => {
    // title, image, rating, description, category
    let title = req.body.title;
    let image = req.body.reviewURL;
    let rating = req.body.rate;
    let category = req.body.category;
    let description = req.body.description;
    let userId = req.user.id;
    // recaptcha -- advanced feature
    const resKey = req.body['g-recaptcha-response'];
    const secretKey = '6LdLCYogAAAAAH7S5icpeSR4cCVxbhXF3LTHN4ur';
    const query = stringify({
        secret: secretKey,
        response: resKey,
        remoteip: req.connection.remoteAddress
    })
    const verifyURL = `https://www.google.com/recaptcha/api/siteverify?${query}`;
    const body = await fetch(verifyURL).then(res => res.json());
    // if not successful
    if (body.success !== undefined && !body.success) {
        flashMessage(res, 'error', 'Please click recaptcha!');
        res.redirect('/student/review/create');
    }
    // if successful
    if (body.success) {
        const message = 'Review successfully submitted';
        flashMessage(res, 'success', message);
        Review.create({ title, category, image, rating, description, userId })
            .then((review) => {
                console.log(review.toJSON());
                res.redirect('/student/review/main');
            })
            .catch(err => console.log(err));
    }
});

// EDIT
router.post('/editReview/:id', ensureAuthenticated, async (req, res) => {
    // title, image, rating, description, category
    let title = req.body.title;
    let image = req.body.reviewURL;
    let rating = req.body.rate;
    let category = req.body.category;
    let description = req.body.description;
    let userId = req.user.id;
    // recaptcha -- advanced feature
    const resKey = req.body['g-recaptcha-response'];
    const secretKey = '6LdLCYogAAAAAH7S5icpeSR4cCVxbhXF3LTHN4ur';
    const query = stringify({
        secret: secretKey,
        response: resKey,
        remoteip: req.connection.remoteAddress
    })
    const verifyURL = `https://www.google.com/recaptcha/api/siteverify?${query}`;
    const body = await fetch(verifyURL).then(res => res.json());
    // if not successful
    if (body.success !== undefined && !body.success) {
        flashMessage(res, 'error', 'Please click recaptcha!');
        res.redirect('/student/review/create');
    }
    // if successful
    if (body.success) {
        const message = 'Review slot successfully submitted';
        flashMessage(res, 'success', message);

        Review.update(
            { title, category, image, rating, description, userId },
            { where: { id: req.params.id } }
        )
            .then((result) => {
                console.log(result[0] + ' review updated');
                res.redirect('/student/review/main');
            })
            .catch(err => console.log(err));
    }
});


// DELETE
router.get('/deleteReview/:id', ensureAuthenticated, async function (req, res) {
    try {
        let review = await Review.findByPk(req.params.id);
        if (!review) {
            flashMessage(res, 'error', 'Review not found');
            res.redirect('/student/review/main');
            return;
        }
        if (req.user.id != review.userId) {
            flashMessage(res, 'error', 'Unauthorised access');
            res.redirect('/student/review/main');
            return;
        }
        let result = await Review.destroy({ where: { id: review.id } });
        console.log(result + ' review deleted');
        flashMessage(res, 'info', 'Review deleted');
        res.redirect('/student/review/main');
    }
    catch (err) {
        console.log(err);
    }
});




// image upload
router.post('/upload', (req, res) => {
    // create user id directory for upload if not exist
    if (!fs.existsSync('./public/uploads/review/' + req.user.id)) {
        fs.mkdirSync('./public/uploads/review/' + req.user.id, {
            recursive:
                true
        });
    }
    upload(req, res, (err) => {
        if (err) {
            // e.g. File too large
            res.json({ file: '/uploads/profile/profile.png', err: err });
        }
        else {
            res.json({
                file: `/uploads/review/${req.user.id}/${req.file.filename}`
            });
        }
    });
});





module.exports = router;
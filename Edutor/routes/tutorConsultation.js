const moment = require('moment');
const express = require('express');
const router = express.Router();
const Consultation = require('../models/Booking');
const Review = require('../models/Review');
const flashMessage = require('../helpers/messenger');
const fetch = require('isomorphic-fetch')
const fs = require('fs');
const upload = require('../helpers/imageUpload');
const { stringify } = require('querystring');
// for validation
const ensureAuthenticated = require('../helpers/auth');
const { start } = require('repl');

// for raw sql
const db = require('../config/DBConfig');
const { QueryTypes } = require('sequelize');



router.get('/settings', (req, res) => {
    Consultation.findAll({
        where: { userId: req.user.id },
        order: [['date']],
        raw: true
    })
        .then((consultations) => {
            // pass object to consultation.hbs
            res.render('dashboard/consultationOverview', { consultations, layout: 'main2' });
        })
        .catch(err => console.log(err));
});

router.get('/main', ensureAuthenticated, async (req, res) => {
    let consultations_reviewed = await db.query(`SELECT consultations.*, ROUND(AVG(rating),2) as 'avgRating'
                                    FROM consultations
                                    INNER JOIN reviews
                                    ON consultations.id = reviews.product_id
                                    WHERE consultations.userId = '${req.user.id}'
                                    `, { type: QueryTypes.SELECT });
    let consultations_notreview = await db.query(`SELECT *
                                    FROM consultations
                                    WHERE consultations.userId = '${req.user.id}'
                                    `, { type: QueryTypes.SELECT });
    // console.log(consultations_reviewed);
    console.log(consultations_notreview);

    res.render('consultation/studentConsultation', { consultations_reviewed, consultations_notreview });
    // Consultation.findAll({
    //     where: { userId: req.user.id },
    //     order: [['date']],
    //     raw: true
    // })
    //     .then((consultations) => {
    //         Review.sum('rating', { //updated cart count 
    //             where: { tutor_id: req.user.id },
    //             raw: true
    //         })
    //             .then((reviewrate) => {
    //                 Review.count('price', { //updated cart count 
    //                     where: { tutor_id: req.user.id },
    //                     raw: true
    //                 })
    //                     .then((reviewcount) => {
    //                         var overall = reviewrate / reviewcount;
    //                         console.log(overall);
    //                         res.render('consultation/consultation', { consultations, overall });
    //                     })
    //                     .catch(err => console.log(err));
    //             })
    //             .catch(err => console.log(err));
    //     })
    //     .catch(err => console.log(err));
});


router.get('/create', ensureAuthenticated, (req, res) => {
    res.render('consultation/addConsultation');
});

router.get('/editConsultation/:id', ensureAuthenticated, (req, res) => {
    Consultation.findByPk(req.params.id)
        .then((consultation) => {
            if (!consultation) {
                flashMessage(res, 'error', 'Consultation not found');
                res.redirect('/tutor/consultation/main');
                return;
            }
            if (req.user.id != consultation.userId) {
                flashMessage(res, 'error', 'Unauthorised access');
                res.redirect('/tutor/consultation/main');
                return;
            }

            res.render('consultation/editConsultation', { consultation });
        })
        .catch(err => console.log(err));
});



// CODING LOGIC (CRUD)
// CREATE
router.post('/create', ensureAuthenticated, async (req, res) => {
    let title = req.body.title;
    let consultationURL = req.body.consultationURL;
    let price = req.body.price;
    let description = req.body.description;
    let start_time = moment(req.body.start_time, 'HH:mm:ss');
    let end_time = moment(req.body.end_time, 'HH:mm:ss');
    let date = moment(req.body.consultDate, 'DD/MM/YYYY');
    let userId = req.user.id;
    let roomURL = 'http://localhost:5000/vidroom/';

    // validation -- for price and time
    if (start_time > end_time) {
        if (price < 0) {
            flashMessage(res, 'error', 'Price cannot be negative!');
        }
        flashMessage(res, 'error', 'Enter valid Start and End time!');
        res.redirect('/tutor/consultation/create');
    }
    if (price < 0) {
        flashMessage(res, 'error', 'Price cannot be negative!');
        res.redirect('/tutor/consultation/create');
    }

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
        res.redirect('/tutor/consultation/create');
    }

    // if successful
    if (body.success) {
        const message = 'Consultation slot successfully submitted';
        flashMessage(res, 'success', message);

        Consultation.create({ title, consultationURL, price, description, date, start_time, end_time, roomURL, userId })
            .then((consultation) => {
                console.log(consultation.toJSON());
                res.redirect('/tutor/consultation/main');
            })
            .catch(err => console.log(err));
    }
});


// EDIT
router.post('/editConsultation/:id', ensureAuthenticated, async (req, res) => {
    let title = req.body.title;
    let consultationURL = req.body.consultationURL;
    let price = req.body.price;
    let description = req.body.description;
    let start_time = moment(req.body.start_time, 'HH:mm');
    let end_time = moment(req.body.end_time, 'HH:mm');
    let date = moment(req.body.consultDate, 'DD/MM/YYYYs');
    let userId = req.user.id;

    // validation
    if (start_time > end_time) {
        if (price < 0) {
            flashMessage(res, 'error', 'Price cannot be negative!');
        }
        flashMessage(res, 'error', 'Enter valid Start and End time!');
        res.redirect('/tutor/consultation/create');
    }
    if (price < 0) {
        flashMessage(res, 'error', 'Price cannot be negative!');
        res.redirect('/tutor/consultation/create');
    }

    // recaptcha -- advanced feature
    const resKey = req.body['g-recaptcha-response'];
    const secretKey = '6LdLCYogAAAAAH7S5icpeSR4cCVxbhXF3LTHN4ur';
    const query = stringify({
        secret: secretKey,
        response: resKey,
        remoteip: req.connection.remoteAddress
    })

    // verify url
    const verifyURL = `https://www.google.com/recaptcha/api/siteverify?${query}`;

    const body = await fetch(verifyURL).then(res => res.json());

    // if not successful
    if (body.success !== undefined && !body.success) {
        flashMessage(res, 'error', 'Please click recaptcha!');
        res.redirect('/tutor/consultation/create');
    }

    // if successful
    if (body.success) {
        const message = 'Consultation slot successfully submitted';
        flashMessage(res, 'success', message);

        Consultation.update(
            { title, consultationURL, price, description, date, start_time, end_time, userId },
            { where: { id: req.params.id } }
        )
            .then((result) => {
                console.log(result[0] + ' consultation updated');
                res.redirect('/tutor/consultation/main');
            })
            .catch(err => console.log(err));
    }
});



// DELETE
router.get('/deleteConsultation/:id', ensureAuthenticated, async function (req, res) {
    try {
        let consultation = await Consultation.findByPk(req.params.id);
        if (!consultation) {
            flashMessage(res, 'error', 'Consultation not found');
            res.redirect('/tutor/consultation/main');
            return;
        }
        if (req.user.id != consultation.userId) {
            flashMessage(res, 'error', 'Unauthorised access');
            res.redirect('/consultation/listConsultations');
            return;
        }

        let result = await Consultation.destroy({ where: { id: consultation.id } });
        console.log(result + ' consultation deleted');
        res.redirect('/tutor/consultation/main');
    }
    catch (err) {
        console.log(err);
    }
});




// image upload
router.post('/upload', (req, res) => {
    // create user id directory for upload if not exist
    if (!fs.existsSync('./public/uploads/consultation/' + req.user.id)) {
        fs.mkdirSync('./public/uploads/consultation/' + req.user.id, {
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
                file: `/uploads/consultation/${req.user.id}/${req.file.filename}`
            });
        }
    });

});




module.exports = router;
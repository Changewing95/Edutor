const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const flashMessage = require('../helpers/messenger');
const fetch = require('isomorphic-fetch')
const { stringify } = require('querystring');
const fs = require('fs');
const upload = require('../helpers/reviewImageUpload');

// for validation
// const ensureAuthenticated = require('../helpers/auth');


// REVIEW
// ROUTES (GET)

// for students
router.get('/main', (req, res) => {
    Review.findAll({
        // where: { userId: req.user.id },
        order: [['title']],
        raw: true
    })
        .then((reviews) => {
            // pass object to review.hbs
            res.render('review/review', { reviews });
        })
        .catch(err => console.log(err));
});

router.get('/create', (req, res) => {
    res.render('review/addReview');
});


// ROUTES (POST)
// CREATE
router.post('/create', async (req, res) => {
    // title, image, rating, description, category
    let title = req.body.title;
    let image = req.body.reviewURL;
    let rating = req.body.rate;
    let category = req.body.category;
    let description = req.body.description;
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
        Review.create({ title, category, image, rating, description })
            .then((review) => {
                console.log(review.toJSON());
                res.redirect('/student/review/main');
            })
            .catch(err => console.log(err));
    }
});

// EDIT
router.post('/editReview/:id', async (req, res) => {
    // title, image, rating, description, category
    let title = req.body.title;
    let image = req.body.reviewURL;
    let rating = req.body.rate;
    let category = req.body.category;
    let description = req.body.description;
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
            { title, category, image, rating, description },
            { where: { id: req.params.id } }
        )
            .then((result) => {
                console.log(result[0] + ' review updated');
                res.redirect('/student/review/main');
            })
            .catch(err => console.log(err));
    }
});





// CONSULTATION CODES:
// // CODING LOGIC (CRUD)
// // DELETE
// router.get('/deleteReview/:id', async function (req, res) {
//     try {
//         let review = await Review.findByPk(req.params.id);
//         if (!review) {
//             flashMessage(res, 'error', 'Review not found');
//             res.redirect('/student/review/listReview');
//             return;
//         }
//         /*
//         if (req.user.id != review.userId) {
//             flashMessage(res, 'error', 'Unauthorised access');
//             res.redirect('/review//listReviews');
//             return;
//         }
//         */

//         let result = await Review.destroy({ where: { id: review.id } });
//         console.log(result + ' review deleted');
//         res.redirect('/student/review/listReview');
//     }
//     catch (err) {
//         console.log(err);
//     }
// });




// image upload
router.post('/upload', (req, res) => {
    // create user id directory for upload if not exist
    if (!fs.existsSync('./public/uploads/review/' + 1)) {
        fs.mkdirSync('./public/uploads/review/' + 1, {
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
                file: `/uploads/review/1/${req.file.filename}`
            });
        }
    });
});





module.exports = router;
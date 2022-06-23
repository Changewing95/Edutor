const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const flashMessage = require('../helpers/messenger');

// for validation
// const ensureAuthenticated = require('../helpers/auth');


// REVIEW
// ROUTES (GET)
// for tutors
router.get('/listReview', (req, res) => {
    Review.findAll({
        // where: { userId: req.user.id },
        order: [['title']],
        raw: true
    })
        .then((reviews) => {
            // pass object to review.hbs
            res.render('review/overview', { reviews });
        })
        .catch(err => console.log(err));
});

// ROUTES (POST)




module.exports = router;
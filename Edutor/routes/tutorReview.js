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
    res.render('review/overview');
})

// ROUTES (POST)




module.exports = router;
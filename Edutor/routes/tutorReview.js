const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const flashMessage = require('../helpers/messenger');
const db = require('../config/DBConfig');
const Sequelize = require('sequelize');
const sequelize = require('../config/DBConfig');

// for validation
// const ensureAuthenticated = require('../helpers/auth');


// REVIEW
// ROUTES (GET)
// for tutors
router.get('/listReview', async (req, res) => {
    Review.findAll({
        // where: { userId: req.user.id },
        attributes: [
            'title', 'category', 'image', 'rating', 'description', 'createdAt',
            [sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col('rating')), 2), 'ratingAvg',]
        ],
        order: [['title']],
        raw: true
    })
        .then((reviews) => {
            // pass object to review.hbs
            res.render('review/overview.hbs', { reviews });
        })
        .catch(err => console.log(err));
});


// ROUTES (POST)




module.exports = router;
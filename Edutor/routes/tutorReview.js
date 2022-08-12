const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const flashMessage = require('../helpers/messenger');
const db = require('../config/DBConfig');
const { QueryTypes } = require('sequelize');

// for validation
// const ensureAuthenticated = require('../helpers/auth');

function calculatePercentage(ratingCount, totalCount) {
    percentage = 0;
    percentage = ratingCount / totalCount * 100;
    return percentage;
}


// REVIEW
// ROUTES (GET)
// for tutors
router.get('/listReview', async (req, res) => {
    var userId = req.user.id;
    // query avg rating
    let avgRating = await db.query(`SELECT AVG(rating) as 'avgRating'
                                    FROM reviews
                                    WHERE tutor_id = '${userId}'`, { type: QueryTypes.SELECT });
    // query for review count for each rating (/5)
    let rating5Count = await db.query(`SELECT COUNT(rating) as 'rate5'
                                    FROM reviews
                                    WHERE rating = 5 and tutor_id = '${userId}'`, { type: QueryTypes.SELECT });
    let rating4Count = await db.query(`SELECT COUNT(rating) as 'rate4'
                                    FROM reviews
                                    WHERE rating = 4 and tutor_id = '${userId}'`, { type: QueryTypes.SELECT });
    let rating3Count = await db.query(`SELECT COUNT(rating) as 'rate3'
                                    FROM reviews
                                    WHERE rating = 3 and tutor_id = '${userId}'`, { type: QueryTypes.SELECT });
    let rating2Count = await db.query(`SELECT COUNT(rating) as 'rate2'
                                    FROM reviews
                                    WHERE rating = 2 and tutor_id = '${userId}'`, { type: QueryTypes.SELECT });
    let rating1Count = await db.query(`SELECT COUNT(rating) as 'rate1'
                                    FROM reviews
                                    WHERE rating = 1 and tutor_id = '${userId}'`, { type: QueryTypes.SELECT });
    let totalCount = await db.query(`SELECT COUNT(*) AS 'totalrating' FROM reviews`, { type: QueryTypes.SELECT });

    // for percentage count
    const percentage5 = calculatePercentage(rating5Count[0].rate5, totalCount[0].totalrating);
    const percentage4 = calculatePercentage(rating4Count[0].rate4, totalCount[0].totalrating);
    const percentage3 = calculatePercentage(rating3Count[0].rate3, totalCount[0].totalrating);
    const percentage2 = calculatePercentage(rating2Count[0].rate2, totalCount[0].totalrating);
    const percentage1 = calculatePercentage(rating1Count[0].rate1, totalCount[0].totalrating);
    const avgpercentage = calculatePercentage(avgRating[0].avgRating, 5)


    // query for all reviews
    Review.findAll({
        // where: { userId: req.user.id },
        attributes: [
            'title', 'category', 'image', 'rating', 'description', 'username', 'createdAt'],
        order: [['title']],
        where: { tutor_id: req.user.id },
        raw: true
    })
        .then((reviews) => {
            // pass object to review.hbs
            res.render('review/overview.hbs', {
                reviews, avgRating: avgRating[0], rating5: rating5Count[0], rating4: rating4Count[0],
                rating3: rating3Count[0], rating2: rating2Count[0], rating1: rating1Count[0],
                percentage5, percentage4, percentage3, percentage2, percentage1, avgpercentage
            });
        })
        .catch(err => console.log(err));
});


// ROUTES (POST)




module.exports = router;
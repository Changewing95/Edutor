const express = require('express');
const ensureAuthenticated = require('../helpers/auth');
const router = express.Router();
const Consultation = require('../models/Booking');
const OrderItems = require('../models/OrderItems');
const db = require('../config/DBConfig');
const { QueryTypes } = require('sequelize');
const moment = require('moment');
const flashMessage = require('../helpers/messenger');



// ROUTING:
router.get('/settings', ensureAuthenticated, async (req, res) => {
    var userId = req.user.id;
    let consult_detail = await db.query(`SELECT title, date, start_time, end_time, userId, roomURL
                                    FROM consultations
                                    JOIN orderitems
                                    ON consultations.userId = orderitems.tutor_id AND orderitems.prod_name = consultations.title
                                    WHERE orderitems.prodType = 'consultation session' AND orderitems.cust_id = '${userId}' 
                                    GROUP BY title, date, start_time, end_time, userId
                                    ORDER BY date`, { type: QueryTypes.SELECT });


    consult_detail.forEach(element => {
        console.log(element)
        var date = element.date;
        var iscurrentDate = moment(date).isSame(new Date(), "day");
        console.log(`${element.roomURL}`);
        if (iscurrentDate) {
            flashMessage(res, 'success', `You have a ${element.title} consultation today!`);
        }
    });

    res.render('dashboard/student/consultationview', { consult_detail, layout: 'main2' });
});


// route to catalogue for consultation
router.get('/listConsultations', ensureAuthenticated, async (req, res) => {
    // let consultations_reviewed = await db.query(`SELECT consultations.*, ROUND(AVG(rating),2) as 'avgRating'
    //                                 FROM consultations
    //                                 INNER JOIN reviews
    //                                 ON consultations.id = reviews.product_id
    //                                 `, { type: QueryTypes.SELECT });
    // let consultations_notreview = await db.query(`SELECT *
    //                                 FROM consultations
    //                                 `, { type: QueryTypes.SELECT });
    // console.log(consultations_reviewed);
    // console.log(consultations_notreview);

    // res.render('consultation/studentConsultation', { consultations_reviewed, consultations_notreview });
    Consultation.findAll({
        order: [['date']],
        raw: true
    })
        .then((consultations) => {
            // pass object to consultation.hbs
            res.render('consultation/studentConsultation', { consultations });
        })
        .catch(err => console.log(err));
});

// display detailed information of slot detail
router.get('/display/:id', (req, res) => {

    Consultation.findByPk(req.params.id)
        .then((consultation) => {
            res.render('consultation/detailedConsultation', { consultation });
        })
        .catch(err => console.log(err));
});



module.exports = router;
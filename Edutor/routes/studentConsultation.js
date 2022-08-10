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
    //  todo: query for roomURL after saving the room url to the db
    var userId = req.user.id;
    let consult_detail = await db.query(`SELECT date, start_time, end_time, roomURL, title
                                    FROM consultations c
                                    INNER JOIN orderitems oi
                                    ON oi.tutor_id = c.userId
                                    WHERE oi.cust_id = '${userId}' and prodType = 'consultation session' 
                                    GROUP BY c.title
                                    ORDER BY date`, { type: QueryTypes.SELECT });
    
    // console.log(consult_detail.roomURL);

    consult_detail.forEach(element => {
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
router.get('/listConsultations', ensureAuthenticated, (req, res) => {
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
const express = require('express');
const ensureAuthenticated = require('../helpers/auth');
const router = express.Router();
const Consultation = require('../models/Booking');
const OrderItems = require('../models/OrderItems');
const db = require('../config/DBConfig');
const { QueryTypes } = require('sequelize');


// ROUTING:
router.get('/settings', ensureAuthenticated, async (req, res) => {
    //  todo: query for roomURL after saving the room url to the db
    let consult_detail = await db.query(`SELECT prod_name, date, start_time, end_time
                                    FROM orderitems oi
                                    INNER JOIN consultations c
                                    ON oi.tutor_id = c.userId
                                    WHERE cust_id = '${req.user.id}' and prodType = 'consultation session' 
                                    GROUP BY oi.prod_name`, { type: QueryTypes.SELECT });

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
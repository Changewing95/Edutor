const express = require('express');
const router = express.Router();

const Event = require('../models/Event');


router.get('/main', (req, res) => {
    Event.findAll({ 
        //where: { userId: req.user.id },
        //order: [['startdate']],
        raw: true
    })
        .then((event) => {
            // pass object to listVideos.handlebar
            res.render('student/event', { event });
        })
        .catch(err => console.log(err));
});
router.get('/display/:id', (req, res) => {

    Event.findByPk(req.params.id)
        .then((event) => {
            res.render('student/detailedevent', { event });
        })
        .catch(err => console.log(err));
});


module.exports = router;
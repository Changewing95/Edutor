const express = require('express');
const router = express.Router();

//const flashMessage = require('../helpers/messenger');
const moment = require('moment');
const Event = require('../models/Event');




router.get('/main', (req, res) => {
    Event.findAll({
        //where: { userId: req.user.id },
        //order: [['startdate']],
        raw: true
        })
        .then((event) => {
        // pass object to listVideos.handlebar
        res.render('tutor/event', { event });
        })
        .catch(err => console.log(err));
});

router.get('/create', (req, res) => {
    res.render('tutor/addEvent');
});
router.post('/create', (req, res) => {
    let title = req.body.title;
    // let image = req.body.image
    let description = req.body.description;
    let startdate = moment(req.body.startdate, 'DD/MM/YYYY');
    let enddate = moment(req.body.enddate, 'DD/MM/YYYY');
    let starttime = req.body.starttime;
    let endtime = req.body.endtime;
    let people = req.body.people;
    let status = req.body.status;
    //let userId = req.user.id;
    Event.create(
    { title, description, startdate, enddate, starttime, endtime, people, status }
    )
    .then((event) => {
    console.log(event.toJSON());
    res.redirect('/tutor/main');
    })
    .catch(err => console.log(err))
    });



module.exports = router;
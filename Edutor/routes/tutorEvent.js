const express = require('express');
const router = express.Router();
const flashMessage = require('../helpers/messenger');
const moment = require('moment');
const Event = require('../models/Event');

const path = require('path')
const fs = require('fs');
const upload = require('../helpers/eventimageupload');
const ensureAuthenticated = require('../helpers/auth');
const { Console } = require('console');



router.get('/main', ensureAuthenticated, (req, res) => {
    Event.findAll({
        where: { userId: req.user.id },
        //order: [['startdate']],
        raw: true
    })
        .then((event) => {
            // pass object to listVideos.handlebar
            res.render('tutor/tutorEvent', { event });
        })
        .catch(err => console.log(err));
});

router.get('/create', ensureAuthenticated, (req, res) => {
    res.render('tutor/addEvent');
});
// router.post('/create', (req, res) => {
//     if (!fs.existsSync('./public/uploads/')) {
//         fs.mkdirSync('./public/uploads/' , {
//             recursive:
//                 true
//         });
//     }
//     upload(req, res, (err) => {
//         if (err) {
//             // e.g. File too large
//             res.json({ file: '/uploads/profile/profile.png', err: err });
//         }
//         else {

//         let title = req.body.title;
//         // let image = req.body.image
//         let description = req.body.description;
//         let startdate = moment(req.body.startdate, 'DD/MM/YYYY');
//         let enddate = moment(req.body.enddate, 'DD/MM/YYYY');
//         let starttime = req.body.starttime;
//         let endtime = req.body.endtime;
//         let people = req.body.people;
//         let status = req.body.status;
//         //let userId = req.user.id;

//         const message = 'Event successfully uploaded';
//         flashMessage(res, 'success', message);
//         Event.create(
//             { title, eventImageURL:req.file.filename, description, startdate, enddate, starttime, endtime, people, status }
//         )
//             .then((event) => {
//                 console.log(event.toJSON());
//                 res.redirect('/tutor/event/main');
//             })
//             .catch(err => console.log(err))
//         }
//     });
// });



router.post('/create', ensureAuthenticated, (req, res) => {
    if (!fs.existsSync('./public/eventuploads/')) {
        fs.mkdirSync('./public/eventuploads/' + { recursive: true });
    }
    upload(req, res, (err) => {
        if (err) {
            console.log(req.files, "asd")
            // e.g. File too large
            res.json({ file: '/img/no-image.jpg', err: err });
        }
        else {


            console.log(req.files['posterUpload'][0].filename)

            // note from yl to dylan:
            // change to " `/eventuploads/${req.user.id}/` +" once u add in userid to file path 
            // take note of the '', its not the usual '' but the slanted ``
            var eventlink = '/eventuploads/1/' + req.files['posterUpload'][0].filename

            let title = req.body.title;
            // let image = req.body.image
            let description = req.body.description;
            let startdate = moment(req.body.startdate, 'DD/MM/YYYY');
            let enddate = moment(req.body.enddate, 'DD/MM/YYYY');
            let starttime = moment(req.body.starttime, 'HH:mm:ss');
            let endtime = moment(req.body.endtime, 'HH:mm:ss');
            let people = req.body.people;
            let status = req.body.status;
            let price = req.body.price;
            let userId = req.user.id;
            let zoomlink = req.body.zoomlink;




            let errorstatus = false;
            if (price < 0 && startdate > enddate && starttime > endtime) {
                errorstatus = true;
                flashMessage(res, 'error', 'Multiple Invalid Inputs!');
                res.redirect('/tutor/event/create');

            }
            else if (price < 0 && startdate > enddate){
                errorstatus = true;
                flashMessage(res, 'error', 'Invalid Price & Date!');
                res.redirect('/tutor/event/create');

            }
            else if (price < 0 && starttime > endtime){
                errorstatus = true;
                flashMessage(res, 'error', 'Invalid Price & Time!');
                res.redirect('/tutor/event/create');

            }
            else if ( starttime > endtime && startdate > enddate){
                errorstatus = true;
                flashMessage(res, 'error', 'Invalid Date and Time!');
                res.redirect('/tutor/event/create');

            }
            else if (price < 0) {
                errorstatus = true;
                flashMessage(res, 'error', 'Invalid Price!');
                res.redirect('/tutor/event/create');
            }
            else if (startdate > enddate) {
                errorstatus = true;
                flashMessage(res, 'error', 'Invalid Dates!');
                res.redirect('/tutor/event/create');
            }
            else if (starttime > endtime){
                errorstatus = true;
                flashMessage(res, 'error', 'Invalid Time!');
                res.redirect('/tutor/event/create');
            }

            if (errorstatus == false) {
                Event.create(
                    { title, eventURL: eventlink, description, startdate, enddate, starttime, endtime, people, status, price, userId, zoomlink}
                )
                    .then((event) => {
                        console.log(event.toJSON());
                        res.redirect('/tutor/event/main');
                    })
                    .catch(err => console.log(err))



                // res.json({ file: `/eventuploads/${req.file.filename}` });
            }
        }
    });

});


router.get('/editEvent/:id', ensureAuthenticated, (req, res) => {
    Event.findByPk(req.params.id)
        .then((event) => {
            if (!event) {
                flashMessage(res, 'error', 'Event not found');
                res.redirect('/tutor/event/main');
                return;
            }
            res.render('tutor/editEvent', { event });
        })
        .catch(err => console.log(err));
});

router.post('/editEvent/:id', ensureAuthenticated, (req, res) => {
    let title = req.body.title;
    // let image = req.body.image

    // from yl, to dylan: add in " '/eventuploads/1/' + " after u implement updating of image. 
    // another note: change to " `/eventuploads/${req.user.id}/` +" once u add in userid to file path 

    let description = req.body.description;
    let startdate = moment(req.body.startdate, 'DD/MM/YYYY');
    let enddate = moment(req.body.enddate, 'DD/MM/YYYY');
    let starttime = moment(req.body.starttime, 'HH:mm:ss');
    let endtime = moment(req.body.endtime, 'HH:mm:ss');
    let people = req.body.people;
    let status = req.body.status;
    let price = req.body.price;
    let userId = req.user.id;
    let zoomlink = req.body.zoomlink;
    let errorstatus = false;
    if (price < 0 && startdate > enddate && starttime > endtime) {
        errorstatus = true;
        flashMessage(res, 'error', 'Multiple Invalid Inputs! Failed to update!');
        res.redirect('/tutor/event/main');

    }
    else if (price < 0 && startdate > enddate){
        errorstatus = true;
        flashMessage(res, 'error', 'Invalid Price & Date! Failed to update!');
        res.redirect('/tutor/event/main');

    }
    else if (price < 0 && starttime > endtime){
        errorstatus = true;
        flashMessage(res, 'error', 'Invalid Price & Time! Failed to update!');
        res.redirect('/tutor/event/main');

    }
    else if ( starttime > endtime && startdate > enddate){
        errorstatus = true;
        flashMessage(res, 'error', 'Invalid Date and Time! Failed to update!');
        res.redirect('/tutor/event/main');

    }
    else if (price < 0) {
        errorstatus = true;
        flashMessage(res, 'error', 'Invalid Price! Failed to update!');
        res.redirect('/tutor/event/main');
    }
    else if (startdate > enddate) {
        errorstatus = true;
        flashMessage(res, 'error', 'Invalid Dates! Failed to update!');
        res.redirect('/tutor/event/main');
    } 
    else if (starttime > endtime){
        errorstatus = true;
        flashMessage(res, 'error', 'Invalid Time! Failed to update!');
        res.redirect('/tutor/event/main');
    }

    
    if (errorstatus == false) {
    Event.update(
        { title, description, startdate, enddate, starttime, endtime, people, status, price, userId,zoomlink },
        { where: { id: req.params.id } }

    )
        .then((result) => {
            console.log(result[0] + ' event updated');
            res.redirect('/tutor/event/main');
        })
        .catch(err => console.log(err));
    }
});

router.get('/deleteEvent/:id', ensureAuthenticated, async function
    (req, res) {
    try {
        let event = await Event.findByPk(req.params.id);
        if (!event) {
            flashMessage(res, 'error', 'Event not found');
            res.redirect('/tutor/event/main');
            return;
        }
        // if (req.user.id != event.userId) {
        //     flashMessage(res, 'error', 'Unauthorised access');
        //     res.redirect('/tutor/event/main');
        //     return;
        // }
        let result = await Event.destroy({ where: { id: event.id } });
        console.log(result + ' event deleted');
        res.redirect('/tutor/event/main');
    }
    catch (err) {
        console.log(err);
    }
});

// router.post('/upload', (req, res) => {
//     // Creates user id directory for upload if not exist
//     if (!fs.existsSync('../public/eventuploads/')) {
//         fs.mkdirSync('../public/eventuploads/' + { recursive: true });
//     }
//     upload(req, res, (err) => {
//         if (err) {
//             // e.g. File too large
//             res.json({ file: '/img/no-image.jpg', err: err });
//         }
//         else {
//             res.json({ file: `/uploads/${req.file.file.name}` });
//         }
//     });
// });

module.exports = router;

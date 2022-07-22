const express = require('express');
const router = express.Router();
const flashMessage = require('../helpers/messenger');
const moment = require('moment');
const Event = require('../models/Event');
const path = require('path')
const fs = require('fs');
const upload = require('../helpers/eventimageupload');


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



router.post('/create', (req, res) => {
    if (!fs.existsSync('../public/eventuploads/')) {
        fs.mkdirSync('../public/eventuploads/' + { recursive: true });
    }
    upload(req, res, (err) => {
        if (err) {
            console.log(req.files, "asd")
            // e.g. File too large
            res.json({ file: '/img/no-image.jpg', err: err });
        }
        else {

            console.log(req.files['posterUpload'][0].filename)
            var eventlink = req.files['posterUpload'][0].filename
            let title = req.body.title;
            // let image = req.body.image
            let description = req.body.description;
            let startdate = moment(req.body.startdate, 'DD/MM/YYYY');
            let enddate = moment(req.body.enddate, 'DD/MM/YYYY');
            let starttime = req.body.starttime;
            let endtime = req.body.endtime;
            let people = req.body.people;
            let status = req.body.status;
            let price = req.body.price;

            //let userId = req.user.id;
            
        
            Event.create(
                { title, eventURL: eventlink, description, startdate, enddate, starttime, endtime, people, status, price }
            )
                .then((event) => {
                    console.log(event.toJSON());
                    res.redirect('/tutor/event/main');
                })
                .catch(err => console.log(err))
                // res.json({ file: `/eventuploads/${req.file.filename}` });
            
        }
    });

});


router.get('/editEvent/:id', (req, res) => {
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

router.post('/editEvent/:id', (req, res) => {
    let title = req.body.title;
    // let image = req.body.image
    let description = req.body.description;
    let startdate = moment(req.body.startdate, 'DD/MM/YYYY');
    let enddate = moment(req.body.enddate, 'DD/MM/YYYY');
    let starttime = req.body.starttime;
    let endtime = req.body.endtime;
    let people = req.body.people;
    let status = req.body.status;
    let price = req.body.price;
    //let userId = req.user.id;

    Event.update(
        { title, description, startdate, enddate, starttime, endtime, people, status,price },
        { where: { id: req.params.id } }

    )
        .then((result) => {
            console.log(result[0] + ' event updated');
            res.redirect('/tutor/event/main');
        })
        .catch(err => console.log(err));

});

router.get('/deleteEvent/:id', async function
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
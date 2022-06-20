const express = require('express');
const router = express.Router();
// const moment = require('moment');
const Tutorial = require('../models/Tutorial');
const ensureAuthenticated = require('../helpers/auth');
// const fs = require('fs');
// const upload = require('../helpers/imageUpload');

//TO DO:
//1. Retrieve only the tutorials with the current userID (under findall, retrieve when.....- refer to practical)
router.get('/main', ensureAuthenticated, (req, res) => {
    Tutorial.findAll({
        where: { userId: req.user.id },
        raw: true
    })
        .then((tutorials) => {
            // pass object to listVideos.handlebar
            res.render('tutor/tutorial', { tutorials });
        })
        .catch(err => console.log(err));
});


router.get('/create', (req, res) => {
    res.render('tutor/addTutorial');
});
// TO DO:
//1. SAVE THE USER ID TGT WITH THE INFO SO CAN RETRIEVE ACCORDING TO CORRECT USER
//2. fixx image display
//3. Fix video display
router.post('/create', async function (req, res) {
    let title = req.body.title;
    let description = req.body.description;
    let author = req.body.author;
    // let date = moment(req.body.date, 'DD/MM/YYYY');
    let category = req.body.category;
    let price = req.body.price;
    let image = req.body.image;
    let video = req.body.video;
    let userId = req.user.id;
    Tutorial.create(
        { title, description, author, category, price, image, video, userId }
        )
        .then((tutorials) => {
        console.log(tutorials.toJSON());
        res.redirect('/tutor/tutorial/main');
        })
        .catch(err => console.log(err))
        });

    //     Tutorial.create(
    //         { title, description, author, category, price, thumbnail, video }
    //         )
    //         .then((tutorials) => {
    //         console.log(tutorials.toJSON());
    //         res.redirect('/tutor/tutorial/main');
    //         })
    //         .catch(err => console.log(err))
    //         });
    // let { title, description, author, category, price, image, video } = req.body;

    // let userId = req.user.id;

    // const message = 'Tutorial slot successfully submitted';
    // flashMessage(res, 'success', message);

    // let tutorial = await Tutorial.create({ title, description, author, category, price, image, video });

    // IMAGE UPLOAD: TO-FIX
    // Creates user id directory for upload if not exist
    // if (!fs.existsSync('./public/uploads/' + 1)) {
    //     fs.mkdirSync('./public/uploads/' + 1, {
    //         recursive:
    //             true
    //     });
    // }
    // upload(req, res, (err) => {
    //     if (err) {
    //         // e.g. File too large
    //         res.json({ file: '/img/no-image.jpg, err:err' });
    //     }
    //     else {
    //         res.json({ file: `/uploads/$req.user.id/${req.file.filename}` });
    //     }
    // });
//     res.redirect('/tutor/tutorial/main');
// });




//NEED TO DO:
//1. Retrieve the specific Tutorial ID that the user clicks (under findall, retrieve when.....- refer to practical)
router.get('/display/:id', (req, res) => {

    Tutorial.findByPk(req.params.id)
        .then((tutorials) => {
            res.render('tutor/detailedTutorial', { tutorials });
        })
        .catch(err => console.log(err));
});

//EDIT
router.get('/editTutorial/:id', (req, res) => {
    Tutorial.findByPk(req.params.id)
        .then((tutorials) => {
            res.render('tutor/editTutorial', { tutorials });
        })
        .catch(err => console.log(err));
});


router.post('/editTutorial/:id', (req, res) => {
    let { title, description, author, category, price, image, video } = req.body;
    Tutorial.update(
        { title, description, author, category, price, image, video },
        { where: { id: req.params.id } }
    )
        .then((result) => {
            console.log(result[0] + ' video updated');
            res.redirect('/tutor/tutorial/main');
        })
        .catch(err => console.log(err));
});


router.get('/deleteTutorial/:id', async function
    (req, res) {
    try {
        let tutorials = await Tutorial.findByPk(req.params.id);
        // if (!video) {
        //     flashMessage(res, 'error', 'Video not found');
        //     res.redirect('/video/listVideos');
        //     return;
        // }
        // if (req.user.id != video.userId) {
        //     flashMessage(res, 'error', 'Unauthorised access');
        //     res.redirect('/video/listVideos');
        //     return;
        // }
        let result = await Tutorial.destroy({ where: { id: tutorials.id } });
        console.log(result + ' video deleted');
        res.redirect('/tutor/tutorial/main');
    }
    catch (err) {
        console.log(err);
    }
});
module.exports = router;


const express = require('express');
const ensureAuthenticated = require('../helpers/auth');
const router = express.Router();
// const moment = require('moment');
const Tutorial = require('../models/Tutorial');
const fs = require('fs');
const upload = require('../helpers/uploadImage');
const flashMessage = require('../helpers/messenger');
const path = require('path')

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



// router.post('/create', async function (req, res) {

//     if (!fs.existsSync('./public/uploads/')) {
//         fs.mkdirSync('./public/uploads/', {
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
//             if (req.file == "undefined") {
//                 console.log("No image selected!")
//             }
//             else {
//                 let title = req.body.title;
//                 let description = req.body.description;
//                 let author = req.body.author;
//                 // let date = moment(req.body.date, 'DD/MM/YYYY');
//                 let category = req.body.category;
//                 let price = req.body.price;
//                 let tutorialImageURL = req.files.tutorialmageURL[0].path;
//                 let video = req.body.req.files.video[0].path;
//                 let userId = req.user.id;
//                 Tutorial.create(
//                     { title, description, author, category, price, tutorialImageURL, video, userId }
//                 )
//                     .then((tutorials) => {

//                         console.log(tutorials.toJSON());
//                         res.redirect('/tutor/tutorial/main');
//                     })
//                     .catch(err => console.log(err))
//             }



//         }


//         });


//     });


// TO DO:
//1. SAVE THE USER ID TGT WITH THE INFO SO CAN RETRIEVE ACCORDING TO CORRECT USER
//2. fixx image display
//3. Fix video display
// router.post('/create', async function (req, res) {

//     if (!fs.existsSync('./public/uploads/' + req.user.id)) {
//         fs.mkdirSync('./public/uploads/' + req.user.id, {
//             recursive:
//                 true
//         });
//     }
//     // try {
//     //     const file = req.body.video
//     //     console.log(file)
//     //     const savePath = path.join(__dirname, 'public', 'uploads', req.user.id, file.name)
//     //     await file.mv(savePath)
//     // }
//     // catch (error) {
//     //     console.log(error)
//     //     res.send("error uploading vudeo")
//     // }
//     upload(req, res, (err) => {
//         if (err) {
//             // e.g. File too large
//             res.json({ file: '/uploads/profile/profile.png', err: err });
//         }
//         else {
           
//             let title = req.body.title;
//             let description = req.body.description;
//             let author = req.body.author;
//             // let date = moment(req.body.date, 'DD/MM/YYYY');
//             let category = req.body.category;
//             let price = req.body.price;
//             // let tutorialImageURL = req.body.tutorialImageURL;
//             let video = req.body.video;
//             let userId = req.user.id;

        
//                 // res.json({
//                 //     file: `/uploads/${req.user.id}/${req.file.filename}`

//                 // });
//                 const message = 'Tutorial successfully uploaded';
//                 flashMessage(res, 'success', message);
//                 Tutorial.create(
//                     { title, description, author, category, price, tutorialImageURL: req.file.filename, video, userId }
//                 )
//                     .then((tutorials) => {

//                         console.log(tutorials.toJSON());
//                         res.redirect('/tutor/tutorial/main');
//                     })
//                     .catch(err => console.log(err))
//             }
//     });


// });
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


router.post('/create', async function (req, res) {

    if (!fs.existsSync('./public/uploads/' + req.user.id)) {
        fs.mkdirSync('./public/uploads/' + req.user.id, {
            recursive:
                true
        });
    }

    upload(req, res, (err) => {
        if (err) {
            // e.g. File too large
            res.json({ file: '/uploads/profile/profile.png', err: err });
        }
        else {

            console.log(req.files);
            var imageUpload = req.files['tutorialImageUpload'][0].filename
            var videoUpload = req.files['tutorialVideoUpload'][0].filename
            let title = req.body.title;
            let description = req.body.description;
            let author = req.body.author;
            // let date = moment(req.body.date, 'DD/MM/YYYY');
            let category = req.body.category;
            let price = req.body.price;
            // let tutorialImageURL = req.body.tutorialImageURL;
            let video1 = req.session.video;
            let userId = req.user.id;
            const message = 'Tutorial successfully uploaded';
            flashMessage(res, 'success', message);
            Tutorial.create(
                { title, description, author, category, price, tutorialImageURL: imageUpload, video:videoUpload , userId }
            )
                .then((tutorials) => {

                    console.log(tutorials.toJSON());
                    res.redirect('/tutor/tutorial/main');
                })
                .catch(err => console.log(err))
        }
    });


});


router.get('/get-video/:fileName', (req, res) => {
    res.sendFile(`uploads/${req.user.id}/${req.params.fileName}`, { root: 'public' })
})

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

//ORIGINAL (BUT IMAGE ISNT UPDATING)
// router.post('/editTutorial/:id', (req, res) => {
//     // let { title, description, author, category, price, tutorialImageURL: req.file.filename, video } = req.body;
//     let title = req.body.title;
//     let description = req.body.description;
//     let author = req.body.author;
//     // let date = moment(req.body.date, 'DD/MM/YYYY');
//     let category = req.body.category;
//     let price = req.body.price;
//     let tutorialImageURL = req.body.tutorialImageURL;
//     let video = req.body.video;
//     Tutorial.update(
//         { title, description, author, category, price, tutorialImageURL, video },
//         { where: { id: req.params.id } }
//     )
//         .then((result) => {
//             console.log(result[0] + ' video updated');
//             res.redirect('/tutor/tutorial/main');
//         })
//         .catch(err => console.log(err));
// });

//TRY UPDATE 
router.post('/editTutorial/:id', async (req, res) => {
    let tutorial = await Tutorial.findByPk(req.params.id);
    var Imagefile = tutorial.tutorialImageURL;
    var VideoFile = tutorial.video;
    console.log(Imagefile)
    console.log(VideoFile)

    upload(req, res, (err) => {
        if (err) {
            // e.g. File too large
            res.json({ file: '/uploads/profile/profile.png', err: err });
        }
        else {
            console.log(req.files, "ji")
            let title = req.body.title;
            let description = req.body.description;
            let author = req.body.author;
            let category = req.body.category;
            let price = req.body.price;
            let video = req.body.video;
            // console.log(req.files['tutorialImageUpload'][0].filename)
            //many key value pair and many index so the index to find attribute
            //.filename is part of the attribute
            if (req.files['tutorialImageUpload']) {
                
                // console.log(req.file
                Imagefile = req.files['tutorialImageUpload'][0].filename
                // Imagefile = "hi"
            }
            if (req.files['tutorialVideoUpload']) {
                VideoFile = req.files['tutorialVideoUpload'] [0].filename

            }
            const message = 'Tutorial successfully edited';
            flashMessage(res, 'success', message);
            Tutorial.update(
                { title, description, author, category, price, tutorialImageURL: Imagefile, video:VideoFile }, { where: { id: req.params.id } }
            )
                .then((tutorials) => {

                    // console.log(tutorials.toJSON());
                    res.redirect('/tutor/tutorial/main');
                })
                .catch(err => console.log(err))
        }
    });

});

//usudiisaiud
// router.post('/editTutorial/:id', (req, res) => {

//     // if (!fs.existsSync('./public/uploads/' + req.user.id)) {
//     //     fs.mkdirSync('./public/uploads/' + req.user.id, {
//     //         recursive:
//     //             true
//     //     });
//     // }
//     upload(req, res, (err) => {
//         if (err) {
//             // e.g. File too large
//             res.json({ file: '/uploads/profile/profile.png', err: err });
//         }
//         else {

//             let title = req.body.title;
//             let description = req.body.description;
//             let author = req.body.author;
//             // let date = moment(req.body.date, 'DD/MM/YYYY');
//             let category = req.body.category;
//             let price = req.body.price;
//             // let tutorialImageURL = req.body.tutorialImageURL;
//             // let tutorialImageUpload = req.body.tutorialImageUpload;
//             let video = req.body.video;
//             // let userId = req.user.id;

//             // res.json({
//             //     file: `/uploads/${req.user.id}/${req.file.filename}`

//             // });
//             Tutorial.update(
//                 { title, description, author, category, price, tutorialImageURL: req.file.filename, video },
//                 { where: { id: req.params.id } }
//             )
//                 .then((result) => {
//                     console.log(result[0] + ' video updated');
//                     res.redirect('/tutor/tutorial/main');
//                 })
//                 .catch(err => console.log(err));
//         }
//     });


// });


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
        const message = 'Tutorial successfully deleted';
        flashMessage(res, 'success', message);
        let result = await Tutorial.destroy({ where: { id: tutorials.id } });
        console.log(result + ' video deleted');
        res.redirect('/tutor/tutorial/main');
    }
    catch (err) {
        console.log(err);
    }
});



router.post('/upload', (req, res) => {
    // Creates user id directory for upload if not exist
    if (!fs.existsSync('./public/uploads/' + req.user.id)) {
        fs.mkdirSync('./public/uploads/' + req.user.id, {
            recursive:
                true
        });
    }
    upload(req, res, (err) => {
        if (err) {
            // e.g. File too large
            res.json({ file: '/uploads/profile/profile.png', err: err });
        }
        else {
            res.json({
                file: `/uploads/${req.user.id}/${req.file.filename}`
            });
        }
    });
});




module.exports = router;

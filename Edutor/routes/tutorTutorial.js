const express = require('express');
const router = express.Router();
// const moment = require('moment');
const Tutorial = require('../models/Tutorial');
// const ensureAuthenticated = require('../helpers/auth');

router.get('/main', (req, res) => {
    res.render('tutor/tutorial');
});

router.get('/create', (req, res) => {
    res.render('tutor/addTutorial');
});

router.post('/create', async function (req, res) {
    let { title, description, author, date, category, price, thumbnail, video } = req.body;

    // let userId = req.user.id;
   
    // const message = 'Tutorial slot successfully submitted';
    // flashMessage(res, 'success', message);

    let tutorial = await Tutorial.create({ title, description, author, date, category, price, thumbnail, video });

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


    res.redirect('/tutor/tutorial/main');
});

module.exports = router;

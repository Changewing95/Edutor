const express = require('express');
const router = express.Router();
const User = require('../models/User')
const flashMessage = require('../helpers/messenger');
const UserController = require('../Controller/User');
const FileUpload = require('../helpers/imageUpload');
const ensureAuthenticated = require('../helpers/checkAuthentication');
const { nextTick } = require('process');
const resolve = require('path').resolve;
const fs = require('fs');
var uuid = require('uuid');
const { pipeline } = require('stream');
const OrderItems = require('../models/OrderItems');
const Order = require('../models/Order');
var Country = require('../models/Country');
const Validate = require('../Controller/validate');






router.get('/overview', ensureAuthenticated, async (req, res) => {
    let studentCount = await User.count({
        where: { roles: "student" }
    })
    let tutorCount = await User.count({
        where: { roles: "tutor" }
    })
    // let getCountry = await User.findOne({where: {}})

    res.render('dashboard/overview', { layout: 'main2', currentpage: { overview: true }, studentCount: studentCount, tutorCount: tutorCount });
});


// CRUD FEATURE FOR USER EDITING


// READ
router.get('/settings', ensureAuthenticated, async (req, res) => {
    await User.findOne({ where: { id: req.user.id } }).then((user) => {
        res.render('dashboard/settings', { layout: 'main2', currentpage: { settings: true }, name: user.name, email: user.email });
    })
});


//  DELETE
router.get('/settings/delete_student', ensureAuthenticated, UserController.DeleteUser);



// UPDATE
router.post('/settings', ensureAuthenticated, UserController.UpdateUser);


// PROFILE PICTURE UPLOAD // Advanced Feature - JEREMY
router.put('/profilePictureUpload', async (req, res) => {
    var profile_id = uuid.v1();
    User.update({
        profile_pic: profile_id
    }, { where: { id: req.user.id } }).then((value) => {
        pipeline(req, fs.createWriteStream(resolve(`./public/images/profilepictures/${profile_id}.png`)), (error) => {
            if (!error) {
                console.log('no error')
                res.status(200).json();
            }
        });
    })
})


router.get('/display', async (req, res) => {
    // await User.findOne({ where: { id: req.user.id } }).then((user) => {
    //     if (user) {
    //         console.log(user.profile_pic);
    //         res.sendFile(resolve(`./public/images/profilepictures/${user.profile_pic}.png`))
    //     } else {
    //         res.send("no access");
    //     }
    // }).catch((error) => {
    //     console.log(error);
    // })
    res.sendFile(resolve(`./public/images/profilepictures/${req.user.profile_pic}.png`))


});




// async function getsAllStudent() {
//    await User.count({
//     where: { roles: "student" }
//   }).then((count) => {
//     console.log(count)
//     return count
//   })

// }


router.get('/statistic', (req, res) => {

    Country.findAll({
        // where: { userId: req.user.id },
    })
        .then((countries) => {
            // pass object to consultation.hbs
            res.json(countries.map((country) => {
                return { country: country.country, count: country.count, country_length: country.length }
            }))
        })
        .catch(err => console.log(err));

});


// PROFILE PICTURE UPLOAD // Advanced Feature - JEREMY
router.put('/profilePictureUpload', async (req, res) => {
    // Creates user id directory for upload if not exist
    // FileUpload(req, res, (err) => {
    //     if (err) {
    //         console.log("error1")
    //         res.json({ file: '/img/no-image.jpg', err: err });
    //     } else {
    //         console.log(req.file);
    //         if (req.file === undefined) {
    //             console.log("error2")
    //             res.json({ file: '/img/no-image.jpg', err: err });
    //         } else {
    //             console.log("success")
    //             res.json({ file: `${req.file.filename}` });
    //             User.update({
    //                 profile_pic: req.file.filename
    //             }, { where: { id: req.user.id } }).then(() => {
    //                 res.redirect('settings');
    //             }).catch((errors) => {
    //                 console.log(errors);
    //             })
    //         }
    //     }
    // });
    var profile_id = uuid.v1();
    User.update({
        profile_pic: profile_id
    }, { where: { id: req.user.id } }).then(() => {
        res.redirect('settings');
    }).catch((errors) => {
        console.log(errors);
    })

    pipeline(req, fs.createWriteStream(resolve(`./public/images/profilepictures/${profile_id}.png`)), (error) => {
        if(!error) {
            res.send("succaess");
        }
    });
})



router.get('/display', async (req, res) => {
    // await User.findOne({ where: { id: req.user.id } }).then((user) => {
    //     if (user) {
    //         console.log(user.profile_pic);
    //         res.sendFile(resolve(`./public/images/profilepictures/${user.profile_pic}.png`))
    //     } else {
    //         res.send("no access");
    //     }
    // }).catch((error) => {
    //     console.log(error);
    // })
    res.sendFile(resolve(`./public/images/profilepictures/${req.user.profile_pic}.png`))


});

router.get('/allorders', (req, res) => {

    OrderItems.findAll({
        where:{
            tutor_id: req.user.id,
            status: "ok"
        },
        order: [ [ 'id', 'DESC' ]]
    })
        .then((orders) => {
            // pass object to listVideos.handlebar
            console.log(orders);
            res.render('dashboard/allorders',{ layout: 'main2', orders});
    })
        .catch(err => console.log(err));
});

router.get('/vieworder/:id', (req, res) => {
    Order.findAll({
        where:{
            order_id: req.params.id,
            
        },
        order: [ [ 'id', 'DESC' ]]
    })
        .then((order) => {
            var oid = req.params.id;
            console.log(order);
            res.render('dashboard/editorder', {layout: 'main2',order,oid:oid});
        })
        .catch(err => console.log(err));
});

router.get('/deleteorder/:id', (req, res) => {
    OrderItems.update(
        {
            status:"no",
        },
        { where: { orderId: req.params.id } } //req.params.id is the user id of the person who created this video
    )
        .then((result) => {
            console.log(result[0] + ' video updated');
            res.redirect('/dashboard/allorders');
        })
        .catch(err => console.log(err));
});

router.get('/student/yourorders', (req, res) => {
    Order.findAll({ 
        where:{
            userId: req.user.id,
        },
        order: [ [ 'id', 'DESC' ]]
    })
        .then((orders) => {
            res.render('dashboard/student/yourorders',{orders});
        })
        .catch(err => console.log(err));
});

router.get('/vieworder/:id', (req, res) => {
    OrderItems.findAll({
        where:{
            orderId: req.params.id,
            status: "ok"
        },
        order: [ [ 'id', 'DESC' ]]
    })
        .then((orderitems) => {
            var oid = req.params.id; //order_id
            console.log(orderitems);
            res.render('dashboard/student/orderdetail', {orderitems,oid:oid});
        })
        .catch(err => console.log(err));
});


module.exports = router;

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
const sequelize = require('sequelize');
const Op = require('sequelize').Op;
const moment = require('moment');
// const app = express();
const { pipeline } = require('stream');


// // for video conference
// const server = require("http").Server(app); 	// for socket.io
// const io = require("socket.io")(server);		// for socket.io
// const stream = require('../public/js/stream');

// router.get('/overview', ensureAuthenticated, (req, res) => {
//     res.render('dashboard/overview', { layout: 'main2', currentpage: { overview: true } });

const OrderItems = require('../models/OrderItems');
const Order = require('../models/Order');
var Country = require('../models/Country');
const Validate = require('../Controller/validate');
const { stringify } = require('querystring');
const { Console } = require('console');






router.get('/overview', ensureAuthenticated, async (req, res) => {
    let studentCount = await User.count({
        where: { roles: "student" }
    })
    let tutorCount = await User.count({
        where: { roles: "tutor" }
    })
    const totalAmount = await Order.findAll({
        attributes: [
            'totalPrice',
            [sequelize.fn('sum', sequelize.col('totalPrice')), 'total_amount'],
        ],
        raw: true
    });
    // let getCountry = await User.findOne({where: {}})
    console.log(totalAmount[0]['total_amount'])
    // console.log(totalAmount[0]['dataValues']['total_amount'])

    res.render('dashboard/overview', { layout: 'main2', currentpage: { overview: true }, studentCount: studentCount, tutorCount: tutorCount, netAmount: totalAmount[0]['total_amount'] });
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
        raw: true,
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


function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

router.get('/statisticForOrders', async (req, res) => {
    const op = sequelize.Op;
    var startdate = moment();
    startdate = startdate.subtract(7, "days");
    startdate = startdate.format('YYYY-MM-DD');
    let end = moment().format('YYYY-MM-DD');
    const Records = await Order.findAll({
        attributes: [
            [sequelize.fn('date_format', sequelize.col('createdAt'), '%Y-%m-%d'), 'date_col_formed']
        ]
    })
    // console.log(Records[0]['dataValues']['date_col_formed'])
    let b = {}
    Records.forEach(object => {
        console.log(object['dataValues']['date_col_formed']);
        b[object['dataValues']['date_col_formed']] = (b[object['dataValues']['date_col_formed']] || 0) + 1;

    })    // return res.json(result)
    return res.json({b})


    // const todaysRecord = await Order.findAll({
    //     raw: true,
    //     where: {
    //         createdAt: {
    //             [op.between]: [
    //                 startdate,
    //                 end,
    //             ]
    //         }
    //     }
    // })
    // res.json(todaysRecord.map((object) => {
    //     console.log(formatDate(object.createdAt))
    //     // console.log()

    //     // return  {date : formatDate(object.createdAt) }
    // }))



    // Order.findAll({
    //     group: [sequelize.fn('createdAt', 'day', sequelize.col('createdAt'))]
    //   }).then((object) => {
    //     console.log(object);
    //   })

    // // Order.findAll({
    // //     raw: true,
    // //     distinct: true
    // //     // where: { userId: req.user.id },
    // // })
    // //     .then((orders) => {
    // //         console.log(Object.keys(orders).length);
    // //         // pass object to consultation.hbs
    // //         res.json(orders.map((order) => {
    // //             var createAt = order['createdAt']
    // //             console.log( moment(createAt).format('MM/DD/YYYY'))
    // //             // return { country: country.country, count: country.count, country_length: country.length }
    // //         }))
    // //     })
    // //     .catch(err => console.log(err));

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
        if (!error) {
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
        where: {
            tutor_id: req.user.id,
            status: "ok"
        },
        order: [['id', 'DESC']]
    })
        .then((orders) => {
            // pass object to listVideos.handlebar
            console.log(orders);
            res.render('dashboard/allorders', { layout: 'main2', orders });
        })
        .catch(err => console.log(err));
});

router.get('/vieworder/:id', (req, res) => {
    Order.findAll({
        where: {
            order_id: req.params.id,

        },
        order: [['id', 'DESC']]
    })
        .then((order) => {
            var oid = req.params.id;
            console.log(order);
            res.render('dashboard/editorder', { layout: 'main2', order, oid: oid });
        })
        .catch(err => console.log(err));
});

router.get('/deleteorder/:id', (req, res) => {
    OrderItems.update(
        {
            status: "no",
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
        where: {
            userId: req.user.id,
        },
        order: [['id', 'DESC']]
    })
        .then((orders) => {
            res.render('dashboard/student/yourorders', { orders });
        })
        .catch(err => console.log(err));
});

router.get('/vieworder/:id', (req, res) => {
    OrderItems.findAll({
        where: {
            orderId: req.params.id,
            status: "ok"
        },
        order: [['id', 'DESC']]
    })
        .then((orderitems) => {
            var oid = req.params.id; //order_id
            console.log(orderitems);
            res.render('dashboard/student/orderdetail', { orderitems, oid: oid });
        })
        .catch(err => console.log(err));
});


module.exports = router;
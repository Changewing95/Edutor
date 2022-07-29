const express = require('express');
const router = express.Router();
const Voucher = require('../models/Voucher');
const User = require('../models/User');


router.get('/', (req,res) =>{
    Voucher.findAll({
        where: { tutor_ID: req.user.id },
        raw: true
    })
        .then((vouchersbythisuser) => {
            res.render('vouchers/vouchers', {vouchersbythisuser});
        })
        .catch(err => console.log(err));

});

router.get('/create', (req,res) =>{
    res.render('vouchers/vouchers-create');
});


router.post('/create', (req,res) =>{
   
    var tutor_id = req.user.id 
    var t_name = req.body. tutor_created
    var code = req.body.voucher_code
    var name = req.body.voucher_name
    var v_discount = req.body.voucher_amount


    Voucher.create(
        {voucher_code:code, voucher_name:name, tutor_ID: tutor_id, tutor_name: t_name, discount: v_discount }
    )
        .then((order) => {
            res.redirect('vouchers/');
            console.log(order.toJSON());
        })
        .catch(err => console.log(err))
});

module.exports = router;
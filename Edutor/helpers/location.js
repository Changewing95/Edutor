var Country = require('../models/Country');
var axios = require('axios');

exports.getLocation = async (req, res) => {
    // var ip2 = address.ip();
    console.log('asd');
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    await axios.get(`https://ipapi.co/${ip}/json/`).then((response) => {
        Country.findOrCreate({
            where: {
                country: response.data.country_name
            },
            defaults: { // set the default properties if it doesn't exist
                country: response.data.country_name,
                count: 0
            }
        }).then((data) => {
            Country.findOne({ where: { country: data } }).then((get_country) => {
                Country.update({
                    count: get_country.count + 1
                }, { where: { country: data } }).then(() => {
                    console.log('done')
                })
            })
        })
    })

}



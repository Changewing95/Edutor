const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Country = db.define('country',
    {
        country: { type: Sequelize.STRING },
        count: {type: Sequelize.INTEGER}
    });

module.exports = Country;
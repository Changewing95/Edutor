const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const moment = require('moment');
const sequelize = require('sequelize');

const Product = db.define('product',
    {
        name: { type: Sequelize.STRING },
        price: { type: Sequelize.INTEGER}
    });

    

module.exports = Product;
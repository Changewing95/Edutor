const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const moment = require('moment');
const sequelize = require('sequelize');

const Product = db.define('product',
    {
        name: { type: Sequelize.STRING },
        price: { type: Sequelize.DECIMAL(10,2) }
    });

    

module.exports = Product;
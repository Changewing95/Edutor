const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const moment = require('moment');
const sequelize = require('sequelize');

const OrderItems = db.define('orderItems',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
           },
        prodId:{type: Sequelize.INTEGER},
        qty: {type: Sequelize.INTEGER},
        price: { type: Sequelize.DECIMAL(8,2)}
        //forgein key is order ID
    });

    

module.exports = OrderItems;
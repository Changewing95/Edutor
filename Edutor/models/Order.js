const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const moment = require('moment');

const Order = db.define('order',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
           },

        order_id: {type: Sequelize.INTEGER},
        paym: {type: Sequelize.STRING},
        country:{type: Sequelize.STRING},
        totalPrice: { type: Sequelize.DECIMAL(8,2)},
        product_ids: {type: Sequelize.STRING}
        //foreign key is the student's id (userId)
    });
    
    

module.exports = Order;
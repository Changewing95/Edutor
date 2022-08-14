const sequelize = require('sequelize');
const Sequelize = require('sequelize');
const db = require('../config/DBConfig');


const OrderItems = db.define('orderItems',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        order_id: { type: Sequelize.INTEGER },
        tutor_name: { type: Sequelize.STRING },
        cust_id: { type: Sequelize.STRING },
        tutor_id: { type: Sequelize.STRING },
        prod_name: { type: Sequelize.STRING },
        prodType: { type: Sequelize.STRING },
        qty: { type: Sequelize.INTEGER },
        status: { type: Sequelize.STRING },
        price: { type: Sequelize.DECIMAL(8, 2) },
        item_detail: { type: Sequelize.STRING },
        leftReview:
        {
            type: sequelize.BOOLEAN,
            defaultValue: false,
        }
    });


module.exports = OrderItems;

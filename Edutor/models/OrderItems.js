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
        cust_name: { type: Sequelize.STRING },
        cust_id: { type: Sequelize.STRING },
        tutor_id: { type: Sequelize.STRING },
        tutor_name: { type: Sequelize.STRING },
        prod_name: { type: Sequelize.STRING },
        prodType: { type: Sequelize.STRING },
        qty: { type: Sequelize.INTEGER },
        status: { type: Sequelize.STRING },
        price: { type: Sequelize.DECIMAL(8, 2) },
        item_detail: { type: Sequelize.STRING },
        left_review: { type: Sequelize.STRING },
        //foreign key is order id from Orders table (model)
    });


module.exports = OrderItems;
const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const moment = require('moment');

const Cart = db.define('cart',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
           },
        
        student_ID: {type: Sequelize.INTEGER},
        product_ID: {type: Sequelize.INTEGER},
        product_name: {type: Sequelize.STRING},
        price: { type: Sequelize.DECIMAL(8,2)},
        image: { type: Sequelize.STRING },
        author: { type: Sequelize.STRING },
        // video: { type: Sequelize.STRING }

        //foreign key is the student's id (userId)
    });
    
    

module.exports = Cart;
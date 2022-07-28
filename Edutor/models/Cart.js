const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Cart = db.define('cart',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
           },
        student_ID: {type: Sequelize.STRING},
        tutor_ID:{type: Sequelize.STRING},
        product_ID: {type: Sequelize.STRING},
        product_name: {type: Sequelize.STRING},
        price: { type: Sequelize.DECIMAL(8,2)},
        image: { type: Sequelize.STRING },
        author: { type: Sequelize.STRING },
        product_type: {type: Sequelize.STRING},
        product_item: {type: Sequelize.STRING},
        // video: { type: Sequelize.STRING }

    });
    
    

module.exports = Cart;
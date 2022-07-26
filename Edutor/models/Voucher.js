const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Voucher = db.define('voucher',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
           },
        tutor_ID:{type: Sequelize.STRING},
        discount: { type: Sequelize.DECIMAL(8,2)},
    });
    
    

module.exports = Voucher;
const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Complain = db.define('complain',
    {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        prodType: { type: Sequelize.STRING },
        prodId: { type: Sequelize.STRING },
        complain: {type: Sequelize.STRING}
    });

module.exports = Complain;
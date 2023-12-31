const Sequelize = require('sequelize');

const sequelize = require('../utils/database')

const OrderItem = sequelize.define('orderItem', {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true, 
        allownull : false,
        primaryKey : true
    },
    quantity : Sequelize.INTEGER
});

module.exports = OrderItem;
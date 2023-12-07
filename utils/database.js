const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'Jonathan98*', {
    dialect : 'mysql',
    host: 'localhost'
});

module.exports = sequelize;
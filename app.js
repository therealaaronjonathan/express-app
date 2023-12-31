const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

//const rootDir = require('./utils/path')
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const sequelize = require('./utils/database')

//Data models
const Product = require('./models/product')
const User = require('./models/user')
const Cart = require('./models/cart')
const CartItem = require('./models/cart-items')
const Order = require('./models/order')
const OrderItem = require('./models/order-items')

const errorController = require("../ExpressJS/controller/error");
const { BelongsTo } = require('sequelize');
const app = express()

//to add templates
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1).then(user => {
        req.user = user;
        next();

    }).catch(err => {console.log(err)});
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use( errorController.get404
);

Product.belongsTo(User, { constraints : true, onDelete: 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through : CartItem });
Product.belongsToMany(Cart, { through : CartItem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through : OrderItem });

sequelize
    //.sync({force : true })
    .sync()
    .then(results => {
        return User.findByPk(1);
    //console.log(results);
    })
    .then(user => {
        if (!user) {
            return User.create({ name: 'Max', email : 'test@test.com'});
        }
        return user;
    })
    .then(user => {
        //console.log(user);
        return user.createCart();
    })
    .then(cart => {
        app.listen(3000);
    })
    .catch(err => {
    console.log(err);
    });

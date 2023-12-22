const Product = require('../models/product');
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.findAll().then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    })
  }).catch(err => {
    console.log(err);
  });
};

exports.getIndex = (req, res, next) => {
Product.findAll().then(products => {
  res.render('shop/index', {
    prods: products,
    pageTitle: 'Shop',
    path: '/'
  })
}).catch(err => {
  console.log(err);
});
};

exports.getCart = (req, res, next) => {
req.user
  .getCart()
  .then(cart => {
    return cart.getProducts().then(products => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products : products
      })
    }).catch(err => console.log(err));
  }).catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  console.log('Adding Product to cart');
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user.getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts( {where: {id:prodId} });
    })
    .then(products => {
      let product; 
      if (products.length > 0) {
        //console.log(products);
        product = products[0];
        console.log(product);
      }
      if (product) {
        const oldQuantity = product.cartItems.quantity;
        newQuantity = oldQuantity + 1;
      }
      return Product.findByPk(prodId);
     
    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: {quantity: newQuantity}
      });
    })
    .then(()=> {
      res.redirect('/cart');
    })
    .catch(err =>  console.log(err));
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user.getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      return req.user.createOrder()
        .then(order => {
          return order.addProducts(products.map(product => {
            product.orderItem = { quantity: product.cartItems.quantity}
            return product
          }));
        })
        .catch(err => console.log(err))
    })
    .then(result => {
      return fetchedCart.setProducts(null);
    })
    .then(result => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err))
};

exports.postCartDelete = (req,res, next) => {
  const prodId = req.body.productId;
  req.user.getCart()
    .then(cart => {
      return cart.getProducts( {where: {id : prodId } })
    })
    .then(products => {
      const product = products[0]
      return product.cartItems.destroy();
    })
    .then(result => {
      res.redirect("/cart");
    })
    .catch(err => console.log(err))
};

exports.getProduct = (req, res, next) => {
  const prodID = req.params.productid;
  /*Product.findAll({where : {id : prodID}})
    .then(products => {
      res.render("shop/product-detail", {
        product: products[0], 
        pageTitle: products[0].title, 
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err)
    });*/
    Product.findByPk(prodID).then(product => {
    res.render("shop/product-detail", {
      product: product, 
      pageTitle: product.title, 
      path: '/products'
    });
  }).catch(err => {console.log(err)});
}

exports.getOrders = (req, res, next) => {
  req.user.getOrders({include: ['products']})
    .then(orders => {
      res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders : orders
    });
  })
    .catch(err => console.log(err))
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};

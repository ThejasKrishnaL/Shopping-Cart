var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helpers')
var userHelpers = require('../helpers/user-helpers');
const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}

const { response } = require('../app');
const collections = require('../config/collections');


/* GET home page. */
router.get('/',async function (req, res, next) {
  let user = req.session.user
  console.log(user);
  let cartCount= null

  if(user){
      cartcount =await userHelpers.getCartCount(req.session.user._id)
  }

  productHelper.getAllProducts().then((products) => {
    res.render('user/view-products', { products, user, cartCount, admin: false })
  })
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/')
  } else {
    res.render('user/login', { "loginErr": req.session.loginErr })
    req.session.loginErr = true
  }
})

router.get('/signup', (req, res) => {
  res.render('user/signup')
})

router.post('/signup', (req, res) => {
  userHelpers.doSignup(req.body).then((response) => {
    console.log(response);
    req.session.loggedIn = true
    req.session.user = response
    res.redirect('/')
  })
})

router.post('/login', (req, res) => {
  userHelpers.dologin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true
      req.session.user = response.user
      res.redirect('/')
    } else {
      req.session.loginErr = "Invaild Email or Password"
      res.redirect('/login')
    }
  })
})


router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})



router.get('/cart', verifyLogin, async (req, res) => {
  let products =await userHelpers.getCartProducts(req.session.user._id)
  console.log(products);  
  res.render('user/cart',{products,user:req.session.user}) 
})



router.get('/add-to-cart/:id',(req, res) => {
  console.log("API CALL");
  userHelpers.addToCart(req.params._id,req.session.user._id).then(() => {
    res.json({status:true})
  })
})


router.post('/change-product-quantity',(req,res,next)=>{
  console.log(req.body);
  userHelpers.changeProductQuantity(req.body).then(()=>{
    
  })
})

module.exports = router;

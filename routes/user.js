var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helpers')
var userHelpers = require('../helpers/user-helpers');
const { response } = require('../app');


/* GET home page. */
router.get('/', function (req, res, next) {

  productHelper.getAllProducts().then((products)=>{
    console.log(products);
    res.render('user/view-products',{products,admin:false})
  })
});

router.get('/login',(req,res)=>{
  res.render('user/login')
})

router.get('/signup',(req,res)=>{
  res.render('user/signup')
})

router.post('/signup',(req,res)=>{
  userHelpers.doSignup(req.body).then((response)=>{
    console.log(response);
  })
})

router.post('/login',(req,res)=>{
  userHelpers.dologin(req.body)
})

module.exports = router;

var express = require('express');
const { log } = require('handlebars');
var router = express.Router();
var productHelper = require('../helpers/product-helpers');
const productHelpers = require('../helpers/product-helpers');

/* GET users listing. */
router.get('/', function(req, res, next) {

  productHelper.getAllProducts().then((products)=>{
    console.log(products);
    res.render('admin/view-products',{products,admin:true})
  })

  
});

router.get('/add-product',(req,res)=>{
  res.render('admin/add-product')
})

router.post('/add-product/',(req,res)=>{
    // console.log(req.body);
    // console.log(req.files.Image);

    productHelper.addProduct(req.body,(id)=>{
      let image = req.files.Image
      console.log(id);
      image.mv('./public/product-images/'+id+'.jpg',(err,done)=>{
        if(!err){
          res.render('admin/add-product')
        }else{
          console.log(err);
        }
      })
      res.render("admin/add-product")
    })
})

router.get('/delete-product/:id',(req,res)=>{
  let prodId = req.params.id
  console.log(prodId);
  productHelpers.deleteProduct(prodId).then((response)=>{
    console.log(response);
    res.redirect('/admin/')
  })
})

router.get('/edit-product/:id',async(req,res)=>{
  let product = await productHelpers.getProductDetails(req.params.id)
  console.log(product);
  res.render('admin/edit-product',{product,admin:true})
})

router.post('/edit-product',(req,res)=>{
  console.log(req.params.id);
  console.log(req.body);
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
  })
})

module.exports = router;

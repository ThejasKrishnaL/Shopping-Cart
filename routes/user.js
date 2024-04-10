var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {

  let products = [
    {
      name: "Apple iPhone 15",
      description: "Apple iPhone 15 (128 GB) - Black",
      category: "Mobile",
      price: "₹72,690",
      image: "https://m.media-amazon.com/images/I/71657TiFeHL._SX679_.jpg"
    },
    {
      name: "Apple iPhone 15 Plus",
      description: "Apple iPhone 15 Plus (128 GB) - Blue",
      category: "Mobile",
      price: "₹80,990",
      image: "https://m.media-amazon.com/images/I/71PjpS59XLL._SX679_.jpg"
    },
    {
      name: "Apple iPhone 15 Pro",
      description: "Apple iPhone 15 Pro (1 TB) - Black Titanium",
      category: "Mobile",
      price: "₹1,77,990",
      image: "https://m.media-amazon.com/images/I/81+GIkwqLIL._SX679_.jpg"
    },
    {
      name: "Apple iPhone 15 Pro Max",
      description: "Apple iPhone 15 Pro Max (256 GB) - Black Titanium",
      category: "Mobile",
      price: "₹1,48,900",
      image: "https://m.media-amazon.com/images/I/81Os1SDWpcL._SX679_.jpg"
    }
  ]

  res.render('index', {products,admin:false});
});

module.exports = router;

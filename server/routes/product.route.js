const {
  getProducts,
  getProduct,
  getSellerProducts,
  getCategoryProducts,
  getPriceRangeProducts,
  getSeller
} = require('../controller/product.controller');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const upload = require('../middleware/multer.middleware');

// Get all products
router.get('/', getProducts);

// Get a single product
router.get('/:id', getProduct);

// Get all products of a seller
router.get('/seller/:id', getSellerProducts);

// Get all products of a category
router.get('/category/:category', getCategoryProducts);

// Get all products within a price range
router.get('/price/:min/:max', getPriceRangeProducts);

// Get the seller of a product
router.get('/seller/:id', getSeller);

module.exports = router;

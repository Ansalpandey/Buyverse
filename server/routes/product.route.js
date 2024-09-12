const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getSellerProducts,
  getCategoryProducts,
  getPriceRangeProducts,
  assignDeliveryAgent
} = require('../controller/product.controller');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const upload = require('../middleware/multer.middleware');

// Create a new product
router.post('/', upload, createProduct);

// Get all products
router.get('/', getProducts);

// Get a single product
router.get('/:id', getProduct);

// Update a product
router.put('/:id', updateProduct);

// Delete a product
router.delete('/:id', deleteProduct);

// Get all products of a seller
router.get('/seller/:id', getSellerProducts);

// Get all products of a category
router.get('/category/:category', getCategoryProducts);

// Get all products within a price range
router.get('/price/:min/:max', getPriceRangeProducts);

// Assign a delivery agent to a product
router.put('/:id/assign', assignDeliveryAgent);

module.exports = router;

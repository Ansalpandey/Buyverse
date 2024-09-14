const {
  getAllDeliveryAgents,
  getTotalProductsInStock,
  getTotalProductsSold,
  createProduct,
  updateStock,
  updateRating,
  getStock,
  getDeliveryAgent,
  assignDeliveryAgent,
  updateProduct,
  deleteProduct
} = require('../controller/seller.controller');
const upload = require('../middleware/multer.middleware');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');

router.get('/delivery-agents',auth, (req, res) => {
  getAllDeliveryAgents(req, res);
});

router.post('/product',auth, upload, (req, res) => {
  createProduct(req, res);
});

module.exports = router;
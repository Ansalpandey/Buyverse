const {
  getAllDeliveryAgents,
  getTotalProductsInStock,
  getTotalProductsSold,
  createProduct,
  updateStock,
  updateRating,
  getStock,
  getDeliveryAgent,
  getAllDeliveryAgents,
  assignDeliveryAgent,
  updateProduct,
  deleteProduct
} = require('../controller/seller.controller');

const express = require('express');
const router = express.Router();

router.get('/delivery-agents', (req, res) => {
  getAllDeliveryAgents(req, res);
});

module.exports = router;
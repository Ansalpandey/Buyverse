const {
  getAllDeliveryAgents,
  getTotalProductsInStock,
  createProduct,
  registerSeller,
  loginSeller,
  updateStock,
  getStock,
  getDeliveryAgent,
  assignDeliveryAgent,
  updateProduct,
  deleteProduct,
} = require("../controller/seller.controller");
const upload = require("../middleware/multer.middleware");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");

router.post("/register-seller", registerSeller);

router.post("/login-seller", loginSeller);

router.get("/delivery-agents", auth, (req, res) => {
  getAllDeliveryAgents(req, res);
});

router.post("/product", auth, upload, (req, res) => {
  createProduct(req, res);
});

router.get("/stock", auth, (req, res) => {
  getStock(req, res);
});

router.get("/delivery-agent/:id", auth, (req, res) => {
  getDeliveryAgent(req, res);
});

router.post("/assign-delivery-agent", auth, (req, res) => {
  assignDeliveryAgent(req, res);
});

router.put("/stock", auth, (req, res) => {
  updateStock(req, res);
});

router.put("/product", auth, upload, (req, res) => {
  updateProduct(req, res);
});

router.delete("/product", auth, (req, res) => {
  deleteProduct(req, res);
});

router.get("/stock/products", auth, (req, res) => {
  getTotalProductsInStock(req, res);
});

module.exports = router;

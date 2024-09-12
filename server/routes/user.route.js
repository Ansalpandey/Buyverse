const {register, login, forgotPassword, requestOTP, verifyOTP} = require("../controller/user.controller");
const express = require("express");
const router = express.Router();

router.post("/register", (req, res) => {
  register(req, res);
});
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/request-otp", requestOTP);
router.post("/verify-otp", verifyOTP);

module.exports = router;
const {register, login, forgotPassword, requestOTP, verifyOTP, resetPassword} = require("../controller/user.controller");
const express = require("express");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/request-otp", requestOTP);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

module.exports = router;
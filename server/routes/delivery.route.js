const {registerDeliveryAgent, loginDeliveryAgent, verifyOTP} = require('../controller/deliveryagent.controller');
const express = require('express');
const router = express.Router();

router.post('/delivery-agent', registerDeliveryAgent);
router.post('/delivery-agent/login', loginDeliveryAgent);
router.post('/delivery-agent/verify', verifyOTP);

module.exports = router;
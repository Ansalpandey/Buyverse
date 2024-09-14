const DeliveryAgent = require('../model/delivery.model.js');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const sendRegistrationOTP = require("../utils/sendotp");

// Register Seller
exports.registerDeliveryAgent = async (req, res) => {
  try {
    const { name, email, password, address, phone, zone } = req.body;

    // Check for required fields
    if (!name || !email || !password || !address || !phone || !zone) {
      return res
        .status(400)
        .json({
          message:
            "Name, email, password, address, zone and phone number is required",
        });
    }

    // Check if seller already exists
    const existingDeliveryAgent = await DeliveryAgent.findOne({ email });
    if (existingDeliveryAgent) {
      return res
        .status(400)
        .json({ message: "Delivery Agent already exists with the provided email" });
    }

    const newDeliveryAgent = new DeliveryAgent({
      name,
      email,
      password,
      address,
      phone,
      role: "Delivery Agent",
      isVerified: false,
      zone: zone
    });

    // Save seller and send OTP
    await newDeliveryAgent.save();
    await sendRegistrationOTP(newDeliveryAgent, res, "Delivery Agent");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login Seller
exports.loginDeliveryAgent = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for required fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find seller by email and role
    const deliveryAgent = await DeliveryAgent.findOne({ email });

    if (!seller) {
      return res.status(400).json({ message: "Seller not found" });
    }

    // Check password
    const isMatch = await deliveryAgent.isPasswordCorrect(password, deliveryAgent.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: deliveryAgent._id, email: deliveryAgent.email, role: deliveryAgent.role },
      process.env.JWT_SECRET,
      { expiresIn: "15d" }
    );

    res.status(200).json({
      message: "Seller logged in successfully",
      token,
      user: {
        id: deliveryAgent._id,
        name: deliveryAgent.name,
        email: deliveryAgent.email,
        role: deliveryAgent.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Verify OTP
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body; // Ensure role is passed in the request body

  try {
    // Find the user by email and role
    const deliveryAgent = await DeliveryAgent.findOne({ email });
    if (!deliveryAgent) {
      return res
        .status(404)
        .json({ message: "Seller not found" });
    }

    // Check if OTP matches and is not expired
    if (deliveryAgent.resetOtp !== otp || deliveryAgent.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Mark user as verified and clear OTP fields
    deliveryAgent.isVerified = true;
    deliveryAgent.resetOtp = undefined;
    deliveryAgent.otpExpires = undefined;
    await deliveryAgent.save();

    // Return success response
    res.status(200).json({
      isVerified: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
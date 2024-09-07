const User = require("../model/user.model");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check for required fields
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    // Default role if not provided
    const userRole = role || "Customer";

    // Validate role
    if (!["Customer", "Seller", "Delivery Agent"].includes(userRole)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email, role });
    if (existingUser) {
      return res
        .status(400)
        .json({
          message: `User already exists with the email ${email} and role ${userRole}`,
        });
    }

    // Create and save the new user
    const newUser = new User({
      name,
      email,
      password,
      role: userRole,
      isVerified: false,
    });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully. Please check your email for OTP.",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isVerified: newUser.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login a user
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Check for required fields
    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Email, password, and role are required" });
    }

    // Find the user by email and role
    const user = await User.findOne({ email, role });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User does not exist or incorrect role" });
    }

    // Check if the user is verified
    if (!user.isVerified) {
      return res
        .status(400)
        .json({ message: "Please verify your email before logging in." });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create a JWT payload
    const payload = {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    };

    // Sign the JWT token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });

    res.status(200).json({
      message: "User logged in successfully!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    await User.findOneAndUpdate(
      { email },
      { password: newPassword },
      { new: true }
    );

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred", error });
  }
};

// Send OTP
exports.requestOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Store the OTP in the user's document
    user.resetOtp = otp;
    user.otpExpires = Date.now() + 15 * 60 * 1000; // 15 minutes expiry
    await user.save();

    // Customize email based on role
    const roleMessage =
      user.role === "Seller"
        ? "Please verify your email to start selling."
        : user.role === "Delivery Agent"
        ? "Please verify your email to start delivering."
        : "Please verify your email to complete your registration.";

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Your OTP for Buyverse Account Password Reset",
      html: `<h2 style="color: #4CAF50;">Your OTP: <strong>${otp}</strong></h2> <p style="font-size: 16px;">This OTP is valid for the next <strong>15 minutes</strong>. ${roleMessage} If you did not request this, please ignore this email, and your account will remain secure.</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
        return res.status(500).json({ message: "Error sending email" });
      } else {
        console.log("Email sent:", info.response);
        return res.status(200).json({
          message: "OTP sent to your email",
        });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the OTP is correct and has not expired
    if (user.resetOtp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Role-based verification (if needed)
    if (user.role === "Customer") {
      // Specific logic for Customer role (if any)
      console.log("Verifying Customer role...");
    } else if (user.role === "Seller") {
      // Specific logic for Seller role (if any)
      console.log("Verifying Seller role...");
    } else if (user.role === "Delivery Agent") {
      // Specific logic for Delivery Agent role (if any)
      console.log("Verifying Delivery Agent role...");
    }

    // Set the isVerified flag to true
    user.isVerified = true;
    user.resetOtp = undefined; // Clear the OTP
    user.otpExpires = undefined; // Clear OTP expiry time
    await user.save();

    res.status(200).json({
      message: "OTP verified successfully, user is now verified",
      isVerified: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    User.findOne({ email }).then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // Update the user's password
      user.password = newPassword;
      user.save();
      return res.status(200).json({ message: "Password reset successfully" });
    });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred", error });
  }
};

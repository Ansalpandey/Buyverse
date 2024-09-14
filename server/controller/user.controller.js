const User = require("../model/user.model");
const Seller = require("../model/seller.model");
const DeliveryAgent = require("../model/delivery.model");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const sendRegistrationOTP = require("../utils/sendotp");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check for required fields
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    // Validate password strength
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }
    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({
        message: "Password must contain at least one uppercase letter",
      });
    }
    if (!/[a-z]/.test(password)) {
      return res.status(400).json({
        message: "Password must contain at least one lowercase letter",
      });
    }
    if (!/[0-9]/.test(password)) {
      return res
        .status(400)
        .json({ message: "Password must contain at least one digit" });
    }
    if (!/[!@#$%^&*]/.test(password)) {
      return res.status(400).json({
        message: "Password must contain at least one special character",
      });
    }

    const userRole = "Customer";

    // Check if the user already exists
    const existingUser = await User.findOne({ email, role: userRole });
    if (existingUser) {
      return res.status(400).json({
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

    // Send OTP email after saving the user
    await sendRegistrationOTP(newUser, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for required fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find customer by email and role
    const customer = await User.findOne({ email, role: "Customer" });
    if (!customer) {
      return res.status(400).json({ message: "Customer not found" });
    }

    // Check password
    const isMatch = await customer.isPasswordCorrect(
      password,
      customer.password
    );
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: customer._id, email: customer.email, role: customer.role },
      process.env.JWT_SECRET,
      { expiresIn: "15d" }
    );

    res.status(200).json({
      message: "Customer logged in successfully",
      token,
      user: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        role: customer.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res
      .status(400)
      .json({ message: "Email and new password are required" });
  }

  if (newPassword.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  if (!/[A-Z]/.test(newPassword)) {
    return res
      .status(400)
      .json({ message: "Password must contain at least one uppercase letter" });
  }

  if (!/[a-z]/.test(newPassword)) {
    return res
      .status(400)
      .json({ message: "Password must contain at least one lowercase letter" });
  }

  if (!/[0-9]/.test(newPassword)) {
    return res
      .status(400)
      .json({ message: "Password must contain at least one digit" });
  }

  if (!/[!@#$%^&*]/.test(newPassword)) {
    return res.status(400).json({
      message: "Password must contain at least one special character",
    });
  }

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
  const { email, otp, role } = req.body; // Ensure role is passed in the request body

  try {
    // Find the user by email and role
    const user = await User.findOne({ email, role });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found for the given role" });
    }

    // Check if OTP matches and is not expired
    if (user.resetOtp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Mark user as verified and clear OTP fields
    user.isVerified = true;
    user.resetOtp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Return success response
    res.status(200).json({
      message: "OTP verified successfully",
      isVerified: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

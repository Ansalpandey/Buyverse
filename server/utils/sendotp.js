const crypto = require("crypto");
const nodemailer = require("nodemailer");

const sendRegistrationOTP = async (user, res, role) => {
  try {
    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Store the OTP in the user's document
    user.resetOtp = otp;
    user.otpExpires = Date.now() + 15 * 60 * 1000; // 15 minutes expiry
    await user.save(); // Save the changes to the actual user document

    const roleMessage =
      role === "Seller"
        ? "Please verify your email to start selling."
        : role === "Delivery Agent"
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
      to: user.email,
      subject: `Welcome to Buyverse! Please verify your email for - ${role} Registration`,
      html: `
      <div style="display: flex; align-items: center; margin-bottom: 20px;">
        <img src="cid:buyverse_logo" alt="Buyverse Logo" style="width: 50px; height: 50px; margin-right: 4px;" />
        <h1 style="color: #000; font-weight: bold; margin: 0;">Buyverse</h1>
      </div>
      <h2 style="color: #000;">Your OTP: <strong>${otp}</strong></h2>
      <p style="font-size: 16px;">This OTP is valid for the next <strong>15 minutes</strong>. ${roleMessage}</p>
    `,
    attachments: [
      {
        filename: "buyverse_logo.png",
        path: "./assets/buyverse_logo.png",
        cid: "buyverse_logo",
      },
    ],
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({
      message: `An OTP has been sent to your email for verification. ${roleMessage}`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = sendRegistrationOTP;

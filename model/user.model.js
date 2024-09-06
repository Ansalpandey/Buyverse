const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    resetOtp: {
      type: String,
      index: { expires: "15m" },
    },
    otpExpires: {
      type: Date,
      index: { expires: "15m" },
    },
  },
  { timestamps: true }
);

// Middleware to hash password before saving
userSchema.pre("save", function (next) {
  const user = this;
  if (user.isModified("password")) {
    bcrypt.hash(user.password, 10, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  } else {
    next();
  }
});

// Middleware to hash password before updating
userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  // Check if the password field is being updated
  if (update.password) {
    try {
      // Find the current user data
      const user = await this.model.findOne(this.getQuery());
      const isSamePassword = await bcrypt.compare(
        update.password,
        user.password
      );
      if (!isSamePassword) {
        // Hash the new password if it's different
        const hashedPassword = await bcrypt.hash(update.password, 10);
        update.password = hashedPassword;
      } else {
        // If the password is the same, remove it from the update
        delete update.password;
      }
    } catch (err) {
      return next(err);
    }
  }
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
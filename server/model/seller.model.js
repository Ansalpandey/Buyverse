const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required']
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  phone: {
    type: String,
    required: [true, 'Phone is required']
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  },

}, { timestamps: true });

const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;
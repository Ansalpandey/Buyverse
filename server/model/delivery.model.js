const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
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
  zone: {
    type: String,
    required: [true, 'Zone is required']
  },
}, { timestamps: true });
const DeliveryAgent = mongoose.model('DeliveryAgent', deliverySchema);

module.exports = DeliveryAgent;
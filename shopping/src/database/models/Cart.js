
const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  customerId: { type: String, required: true },
  items: [
    {
      product: {
        name: String,
        price: Number
      },
      unit: Number
    }
  ]
});

module.exports = mongoose.model('Cart', CartSchema);

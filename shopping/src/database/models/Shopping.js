
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // usamos string para compatibilidad con tu ObjectId manual
  amount: { type: Number, required: true },
  txnId: { type: String, required: true },
  status: { type: String, default: 'received' },
  items: [
    {
      product: {
        name: String,
        price: Number
      },
      unit: Number
    }
  ],
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);

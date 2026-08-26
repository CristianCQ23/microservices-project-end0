const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
    email: { type: String, unique: true },
    password: String,
    salt: String,
    phone: String,
    address: [
        { type: Schema.Types.ObjectId, ref: 'address', required: true }
    ],
    cart: [
        {
            product: {
                _id: { type: String, required: true },
                name: String,
                desc: String,
                type: String,
                banner: String,
                price: Number,
                available: Boolean,
            },
            unit: { type: Number, required: true }
        }
    ],
    wishlist: [
        {
            _id: { type: String, required: true },
            name: String,
            desc: String,
            type: String,
            banner: String,
            available: Boolean,
            price: Number,
        }
    ],
    orders: [
        {
            _id: { type: String, required: true },
            amount: Number,
            txnId: String,
            status: { type: String, default: 'received' },
            items: [
                {
                    product: Schema.Types.Mixed,
                    unit: Number
                }
            ],
            date: { type: Date, default: Date.now }
        }
    ]
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.password;
            delete ret.salt;
            delete ret.__v;
        }
    },
    timestamps: true
});

module.exports = mongoose.model('customer', CustomerSchema);
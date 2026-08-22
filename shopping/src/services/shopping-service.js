const mongoose = require('mongoose');
const axios = require('axios');
const { FormateData } = require('../utils');
const { APIError, BadRequestError } = require('../utils/app-errors');

class ShoppingService {
    constructor() {
        // URL del microservicio de clientes (definida en docker-compose)
        this.customerServiceUrl = process.env.CUSTOMER_SERVICE_URL || 'http://customers:8001';
    }

    async PlaceOrder(customerId, txnId) {
        try {
            // Llamada al microservicio de clientes para obtener el carrito
            const { data: cart } = await axios.get(`${this.customerServiceUrl}/cart/${customerId}`);

            if (!cart || cart.length === 0) {
                throw new BadRequestError('Cart is empty');
            }

            const amount = cart.reduce(
                (total, item) => total + item.product.price * item.unit,
                0
            );

            const order = {
                _id: new mongoose.Types.ObjectId().toString(),
                amount,
                txnId,
                status: 'received',
                items: cart,
                date: new Date(),
            };

            // Llamada al microservicio de clientes para guardar la orden
            const { data } = await axios.post(`${this.customerServiceUrl}/order/${customerId}`, order);

            return FormateData(data);
        } catch (err) {
            if (err instanceof APIError) throw err;
            throw new APIError('PlaceOrderError', 500, err.message);
        }
    }
}


module.exports = ShoppingService;

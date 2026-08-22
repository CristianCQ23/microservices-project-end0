// shopping/src/api/shopping.js

const express = require('express');
const axios = require('axios');
const ShoppingService = require('../services/shopping-service');
const UserAuth = require('./middlewares/auth');

const router = express.Router();
const service = new ShoppingService();

// Ruta de prueba para verificar que el servicio está funcionando
router.get('/', (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'Shopping Service funcionando correctamente'
    });
});

// 👉 POST: crear orden
router.post('/order', UserAuth, async (req, res, next) => {
    try {
        const { _id } = req.user;      // viene del token JWT
        const { txnId } = req.body;    // viene del body

        const { data } = await service.PlaceOrder(_id, txnId);

        return res.json(data);
    } catch (err) {
        next(err);
    }
});

// 👉 GET: consultar órdenes de un cliente
router.get('/orders/:customerId', UserAuth, async (req, res, next) => {
    try {
        const { customerId } = req.params;

        // Proxy hacia el microservicio de clientes
        const { data } = await axios.get(
            `${service.customerServiceUrl}/order/${customerId}`
        );

        return res.json(data);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
const express = require('express');
const UserAuth = require('./middlewares/auth');
const CustomerService = require('../services/customer-service');

const router = express.Router();
const service = new CustomerService();

// Ruta de prueba
router.get('/', (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'Customer Service funcionando correctamente'
    });
});

// Registro
router.post('/signup', async (req, res, next) => {
    try {
        const { email, password, phone } = req.body;
        const { data } = await service.SignUp({ email, password, phone });
        return res.json(data);
    } catch (err) {
        next(err);
    }
});

// Login
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { data } = await service.SignIn({ email, password });
        return res.json(data);
    } catch (err) {
        next(err);
    }
});

// Perfil
router.get('/profile', UserAuth, async (req, res, next) => {
    try {
        const { _id } = req.user;
        const { data } = await service.GetProfile(_id);
        return res.json(data);
    } catch (err) {
        next(err);
    }
});

// Wishlist
router.get('/wishlist', UserAuth, async (req, res, next) => {
    try {
        const { _id } = req.user;
        const { data } = await service.GetWishlist(_id);
        return res.json(data);
    } catch (err) {
        next(err);
    }
});

router.put('/wishlist', UserAuth, async (req, res, next) => {
    try {
        const { _id } = req.user;
        const { product_id } = req.body;
        const { data } = await service.AddToWishlist(_id, product_id);
        return res.json(data);
    } catch (err) {
        next(err);
    }
});

// Órdenes
router.get('/order/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { data } = await service.GetOrders(id);
        return res.json(data);
    } catch (err) {
        next(err);
    }
});

// Eventos internos
router.post('/app-events', async (req, res, next) => {
    try {
        const { payload } = req.body;
        const { data } = await service.SubscribeEvents(payload);
        return res.json(data);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
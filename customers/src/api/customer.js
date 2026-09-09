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
        const product = req.body.product || req.body.product_id || req.body.productId;
        const { data } = await service.AddToWishlist(_id, product);
        return res.json(data);
    } catch (err) {
        next(err);
    }
});

router.delete('/wishlist/:productId', UserAuth, async (req, res, next) => {
    try {
        const { data } = await service.RemoveFromWishlist(
            req.user._id,
            req.params.productId
        );
        return res.json(data);
    } catch (err) {
        next(err);
    }
});

// Carrito
router.get('/cart', UserAuth, async (req, res, next) => {
    try {
        const { data } = await service.GetCart(req.user._id);
        return res.json(data);
    } catch (err) {
        next(err);
    }
});

router.put('/cart', UserAuth, async (req, res, next) => {
    try {
        const { product, qty } = req.body;
        const { data } = await service.AddToCart(req.user._id, product, qty);
        return res.json(data);
    } catch (err) {
        next(err);
    }
});

router.delete('/cart/:productId', UserAuth, async (req, res, next) => {
    try {
        const { data } = await service.RemoveFromCart(req.user._id, req.params.productId);
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
const express = require('express');
const cors = require('cors');

const customerRoutes = require('./api/customer');
const HandleErrors = require('./utils/error-handler');

module.exports = async (app) => {
    app.use(express.json({ limit: '1mb' }));
    app.use(express.urlencoded({ extended: true, limit: '1mb' }));
    app.use(cors());

    // Montar las rutas del microservicio customers
    app.use('/customers', customerRoutes);

    // Manejo de errores
    app.use(HandleErrors);
};
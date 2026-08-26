const express = require('express');
const { PORT, requireVars } = require('./src/config');
const expressApp = require('./src/express-app');

const StartServer = async () => {
    requireVars('CUSTOMERS_URL', 'PRODUCTS_URL', 'SHOPPING_URL');

    const app = express();
    await expressApp(app);

    app.listen(PORT, () => {
        console.log(`gateway listening on port ${PORT}`);
    }).on('error', (err) => {
        console.error(err);
        process.exit(1);
    });
};

StartServer().catch((err) => {
    console.error(`gateway failed to start: ${err.message}`);
    process.exit(1);
});
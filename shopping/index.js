const express = require('express');
const app = express();
const expressApp = require('./src/express-app');
const connectDB = require('./src/database/connection');

const StartServer = async () => {
    await connectDB();
    await expressApp(app);

    app.listen(process.env.PORT || 8003, () => {
        console.log(`Shopping service running on port ${process.env.PORT || 8003}`);
    });
};

StartServer();

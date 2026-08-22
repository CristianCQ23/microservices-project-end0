require('dotenv').config({ quiet: true});

const config = {
    PORT: process.env.PORT || 8003,
    DB_URL: process.env.DB_URL,
    APP_SECRET: process.env.APP_SECRET,
};

config.requireVars = (...names) => {
    const missing = names.filter((name) => !config[name]);

    if (missing.length) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
        process.exit(1);
    }
}

module.exports = config;
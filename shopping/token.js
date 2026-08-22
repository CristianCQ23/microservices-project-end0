const jwt = require('jsonwebtoken');

// Usa el mismo secreto que definiste en tu docker-compose o .env
const APP_SECRET = "dev-secret-change-me";

// Simula un usuario con _id
const payload = {
  _id: "64e8f9c2a1b2c3d4e5f6g7h8" // id de prueba
};

// Genera el token
const token = jwt.sign(payload, APP_SECRET, { expiresIn: "1h" });

console.log("Token de prueba:");
console.log(token);

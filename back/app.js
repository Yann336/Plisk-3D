const express = require('express');
const swaggerUi = require('swagger-ui-express');
// cors permet au navigateur d'autoriser les requêtes cross-origin
const cors = require('cors');
// permet de lire le contenue d'un cookie, elle découpe proprement son contenue
// pour que express puisse lire et utiliser son contenue
const cookieParser = require('cookie-parser');
const swaggerSpec = require('./src/config/swagger');

// dotenv charge les variables du fichier .env
require('dotenv').config();

const app = express(); // La création de l'app
const PORT = process.env.PORT || 3000;
// numéro de port sur lequel le serveur va écouter, on le lit dans le .env et siono 300 par défaut.

app.use(cookieParser());
// autorise Vue.js (port 5173) à contacter Express (port 3000)
app.use(cors({ origin: process.env.FRONT_URL, credentials: true }));

// Route isolée ici et placée avant express.json() car elle utilise express.raw()
// pour lire le corps de la requête. Stripe signe le corps brut (raw) de la requête
// avec le webhook secret ; si express.json() le parsait avant, cette signature
// ne pourrait plus être vérifiée dans le controller.
const purchase = require('./src/routes/purchase');

app.use('/api/purchase', purchase);

//  lis le contenue des requetes
app.use(express.json());

const productsRouter = require('./src/routes/products');

const login = require('./src/routes/auth');

const basket = require('./src/routes/baskets');

const order = require('./src/routes/order');

app.use('/api/products', productsRouter);
app.use('/api/auth', login);
app.use('/api/basket', basket);
app.use('/api/order', order);

// Route documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Lance le serveur sur le port 3000
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

// Exporte l'app pour pouvoir l'utiliser dans d'autres fichiers
module.exports = app;

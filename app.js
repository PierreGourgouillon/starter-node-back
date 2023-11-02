const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
//authMiddleware = require('./middlewares/auth'),
//authRoutes = require('./routes/auth'),
const app = express();

app.use(cors());
app.use(bodyParser.json());

module.exports = app;

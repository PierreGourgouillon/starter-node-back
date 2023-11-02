const express = require('express'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  //authMiddleware = require('./middlewares/auth'),
  //authRoutes = require('./routes/auth'),
  app = express();

app.use(cors());
app.use(bodyParser.json());

//app.use('/api/auth', authMiddleware, authRoutes);

module.exports = app;

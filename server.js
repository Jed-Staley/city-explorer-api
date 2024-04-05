// Installs
const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

// Environment Variables
const PORT = process.env.PORT || 3000;

// Modules
const handleWeather = require('./weather');
const handleMovies = require('./movies');
const callAPI = require('./api-call');

// App Initialization
const app = express();
app.use(cors());

// API calls
handleWeather(app);
handleMovies(app);

// App listener
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`)
})

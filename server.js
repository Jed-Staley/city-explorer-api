// Installs
const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

// Environment Variables
const PORT = process.env.PORT || 3000;
const weatherAPIkey = process.env.WEATHER_API_KEY;
const moviesAPIkey = process.env.MOVIES_API_KEY;

// Modules
const handleWeather = require('./weather');
const handleMovies = require('./movies');

// App Initialization
const app = express();
app.use(cors());

// API calls
handleWeather();
handleMovies();

// App listener
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`)
})

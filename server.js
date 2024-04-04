const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT;
const weatherAPIkey = process.env.WEATHER_API_KEY;
const app = express();
app.use(cors());

app.use(express.static(path.join(__dirname, '../city-explorer')));

// Middleware to set the correct Content-Type header for JavaScript modules
app.use((req, res, next) => {
  if (req.originalUrl.endsWith('.jsx')) {
    res.setHeader('Content-Type', 'application/javascript');
  }
  next();
});

app.get('/api/weather',  async (req, res) => {
  try {
    const city = req.query.city;

    // if (!city) {
    //   return res.status(400).json({ error: 'City parameter is required' });
    // }
    // const weatherData = fs.readFileSync(path.join(__dirname, './data/weather.json'));

    console.log(`https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${weatherAPIkey}&days=3`)
    const response = await fetch(
      `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${weatherAPIkey}&days=3`
    );
    const weatherData = await response.json();
    console.log(weatherData)

    let Forecast = [
      { date: weatherData.data[0].datetime, description: weatherData.data[0].weather.description },
      { date: weatherData.data[1].datetime, description: weatherData.data[1].weather.description },
      { date: weatherData.data[2].datetime, description: weatherData.data[2].weather.description }
    ];
    if (!Forecast) {
      return res.status(404).json({ error: 'Weather data not found for the specified city' });
    }

    res.json(Forecast);
  } catch (error) {
    console.error('Error reading weather data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
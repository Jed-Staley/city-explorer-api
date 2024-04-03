const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
const port = process.env.PORT;

app.use(express.static(path.join(__dirname, '../city-explorer')));

// Middleware to set the correct Content-Type header for JavaScript modules
app.use((req, res, next) => {
  if (req.originalUrl.endsWith('.jsx')) {
    res.setHeader('Content-Type', 'application/javascript');
  }
  next();
});

app.get('/api/weather', (req, res) => {
  try {
    const city = req.query.city;
    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }

    const weatherData = fs.readFileSync(path.join(__dirname, './data/weather.json'));
    const parsedData = JSON.parse(weatherData);
    let forecast;
    for (let i = 0; i < parsedData.length; i++) {
      if (parsedData[i].city_name === city) {
        forecast = [
          { date: parsedData[i].data[0].datetime, description: parsedData[i].data[0].weather.description },
          { date: parsedData[i].data[1].datetime, description: parsedData[i].data[1].weather.description },
          { date: parsedData[i].data[2].datetime, description: parsedData[i].data[2].weather.description }
        ];
        console.log('forecast: ', forecast);
      }
    }
    if (!forecast) {
      return res.status(404).json({ error: 'Weather data not found for the specified city' });
    }

    res.json(forecast);
  } catch (error) {
    console.error('Error reading weather data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
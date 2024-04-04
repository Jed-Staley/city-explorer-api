const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT;
const weatherAPIkey = process.env.WEATHER_API_KEY;
const moviesAPIkey = process.env.MOVIES_API_KEY;

const app = express();
app.use(cors());

app.use(express.static(path.join(__dirname, '../city-explorer')));

const callAPI = (receiveURL, requestURL, dataMassage) => {
  app.get(receiveURL, async (req, res) => {
    try {
      const city = req.query.city;
      console.log('contacting', requestURL(city));
      const response = await fetch(requestURL(city));
      const parsedData = await response.json();
      const massagedData = dataMassage(parsedData);

      if (!massagedData) {
        return res.status(404).json({ error: 'Data not found for the specified city' });
      }
      res.json(massagedData);

    } catch (error) {
      console.error('Error contacting API server: ', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
}

callAPI('/api/weather', (city) => `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${weatherAPIkey}&days=7`, (parsedData) => {
  let returnArr = []
  for (let i = 0; i < parsedData.data.length; i++) {
    returnArr.push({ date: parsedData.data[i].datetime, description: parsedData.data[i].weather.description });
  }
  return returnArr;
})

callAPI('/api/movies', (city) => `https://api.themoviedb.org/3/search/movie?query=${city}&api_key=${moviesAPIkey}`, (parsedData) => {
  let returnArr = []
  for (let i = 0; i < parsedData.results.length; i++) {
    returnArr.push(parsedData.results[i].title);
  }
  return returnArr;
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
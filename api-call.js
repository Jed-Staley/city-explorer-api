const express = require('express');
const app = express();

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

module.exports = callAPI;

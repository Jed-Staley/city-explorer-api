const axios = require('axios');
const cache = require('./cache');

const callAPI = (app, receiveURL, cacheProp, requestURL, dataMassage) => {
  app.get(receiveURL, async (req, res) => {
    const city = req.query.city;
    console.log('city:', city);
    if (cache[city] !== undefined) {
      console.log('Acessing cache');
      const currentTime = new Date();
      const expired = (currentTime.getTime() - cache[city].timeCached.getTime()) > 86400000;
      const dayPassed = currentTime.getDate() !== cache[city].timeCached.getDate();
      if (!expired && !dayPassed) {
        console.log('Reading cache');
        res.json(cache[city][cacheProp])
        return;
      }
      console.log('cache outdated');
    }
  
    try {
      console.log('contacting', requestURL(city));
      const response = await fetch(requestURL(city));
      console.log('response:', response);
      const parsedData = await response.json();
      console.log('parsedData:', parsedData)
      const massagedData = dataMassage(parsedData);
      console.log('massaged:', massagedData);

      if (!massagedData) {
        return res.status(404).json({ error: 'Data not found for the specified city' });
      }

      cache[city] = { timeCached: new Date(), [cacheProp]: [...massagedData] };
      res.json(massagedData);

    } catch (error) {
      console.error('Error contacting API server: ', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
}

module.exports = callAPI;

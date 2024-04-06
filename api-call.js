const axios = require('axios');
const cache = require('./cache');

const callAPI = (app, receiveURL, cacheProp, requestURL, dataMassage) => {
  app.get(receiveURL, async (req, res) => {
    const city = req.query.city;
    console.log('city:', city);
    if (cache[city] !== undefined) {
      if (cache[city][cacheProp] !== undefined) {
        console.log('Acessing cache', cache);
        const currentTime = new Date();
        const expired = (currentTime.getTime() - cache[city][cacheProp].timeCached.getTime()) > 86400000;
        const dayPassed = currentTime.getDate() !== cache[city][cacheProp].timeCached.getDate();
        if (!expired && !dayPassed) {
          console.log('Reading cache');
          res.json(cache[city][cacheProp].data)
          return;
        }
        console.log('cache outdated');
      }
    } else {
      cache[city] = {};
    }
  
    try {
      console.log('contacting', requestURL(city));
      const response = await fetch(requestURL(city));
      const parsedData = await response.json();
      const massagedData = dataMassage(parsedData);
      console.log('massaged:', massagedData);

      if (!massagedData) {
        return res.status(404).json({ error: 'Data not found for the specified city' });
      }

      cache[city][cacheProp] = { timeCached: new Date(), data: [...massagedData] };
      res.json(massagedData);

    } catch (error) {
      console.error('Error contacting API server: ', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
}

module.exports = callAPI;

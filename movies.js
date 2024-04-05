const express = require('express');
const app = express();

const handleMovies = () => {
  callAPI('/api/movies', (city) => `https://api.themoviedb.org/3/search/movie?query=${city}&api_key=${moviesAPIkey}`, (parsedData) => {
    let returnArr = []
    for (let i = 0; i < parsedData.results.length; i++) {
      returnArr.push({ title: parsedData.results[i].title, poster: `https://image.tmdb.org/t/p/w500${parsedData.results[i].poster_path}` });
    }
    return returnArr;
  })
}

module.exports = handleMovies;
'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios')
// const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3002;
const API = process.env.TRIP_ADVISOR_API_KEY


// Establishing connection with atlas DB with URL
// mongoose.connect(process.env.MONGODB_URL);

// // Assigning connection to variable to easily access mongoose connection methods
// const db = mongoose.connection;

// // Listener for any errors, will print out error
// db.on('error', console.error.bind(console, 'connection error'));
// // Runs on 'open' will Console log connected
// db.once('open', () => console.log('Mongoose is connected'));


// Default Route for server checking
app.get('/', (req,res) => res.status(200).send('Default Route Working'));

// class Place {
//   constructor(place) {
//     this.title = place.original_title;
//     this.overview = place.overview;
//     this.average_votes = place.vote_average;
//     this.total_votes = place.vote_count;
//     this.image_url = place.poster_path;
//     this.popularity = place.popularity;
//     this.released_on = place.release_date;
//   }
// }

// *** Getting places for city ***//
app.get('/city', (request, response)=> {
  const city = {
  method: 'GET',
  url: `https://api.content.tripadvisor.com/api/v1/location/search?key=${API}&searchQuery=london&language=en`,
  headers: {accept: 'application/json'}
};
axios
  .request(city)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
})

//** getting description for the location by ID
app.get('/locationdetails', (request, response)=> {
const locationDetails = {
  method: 'GET',
  url: `https://api.content.tripadvisor.com/api/v1/location/154995/details?key=${API}&language=en&currency=USD`,
  headers: {accept: 'application/json'}
};
axios
  .request(locationDetails)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
})

//** getting images for the location by ID
app.get('/locationimg', (request, response)=> {
const locationImg = {
  method: 'GET',
  url: `https://api.content.tripadvisor.com/api/v1/location/154995/photos?key=${API}&language=en`,
  headers: {accept: 'application/json'}
};
axios
  .request(locationImg)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
})




//error handler middleware
app.use((err, req, res, next)=> res.status(500).send(err.message));



app.listen(PORT, () => console.log(`listening on ${PORT}`));

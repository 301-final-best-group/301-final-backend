'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios')
const mongoose = require('mongoose');

const verifyUser = require('./Authorize'); //TODO:  for Auth0 uncomment 1/4

const app = express();
app.use(cors());
app.use(express.json()); 
app.use(verifyUser);     //TODO:  for Auth0 uncomment 2/4 => go to handler.js

const PORT = process.env.PORT || 3002;
const API = process.env.TRIP_ADVISOR_API_KEY
const { getPlacesForCity, getRestaurantForCity } = require('./modules/getPlacesApi');
const crudPlaces = require('./modules/placesHandler')


// *** Establishing connection with atlas DB with URL


mongoose.connect(process.env.MONGODB_URL);

// Assigning connection to variable to easily access mongoose connection methods
const db = mongoose.connection;

// Listener for any errors, will print out error
db.on('error', console.error.bind(console, 'connection error'));
// Runs on 'open' will Console log connected
db.once('open', () => console.log('Mongoose is connected'));


// Default Route for server checking
app.get('/', (req, res) => res.status(200).send('Default Route Working'));


//***Getting Attraction json Data for a city */

app.get('/attractions', async (request, response) => {
    let searchQuery = request.query.searchQuery; //**final queery */
    // let searchQuery = 'miami'
    let places = await getPlacesForCity(searchQuery, process.env.TRIP_ADVISOR_API_KEY);
    response.status(201).send(places);
});

app.get('/restaurants', async (request, response) => {
    let searchQuery = request.query.searchQuery; //**final queery */
    // let searchQuery = 'miami'
    let places = await getRestaurantForCity(searchQuery, process.env.TRIP_ADVISOR_API_KEY);
    response.status(201).send(places);
});


// Routes that run our crud
app.get('/places', crudPlaces.getPlaces);
app.post('/places', crudPlaces.addPlaces);
app.delete('/places/:id', crudPlaces.deletePlaces)
app.put('/places/:id', crudPlaces.updatePlaces)



app.use((err, req, res, next) => res.status(500).send(err.message));



app.listen(PORT, () => console.log(`listening on ${PORT}`));
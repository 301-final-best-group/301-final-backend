'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios')
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());
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
    // let searchQuery = request.query.searchQuery; //**final queery */
    let searchQuery = 'miami'
    let places = await getPlacesForCity(searchQuery, process.env.TRIP_ADVISOR_API_KEY);
    response.status(201).send(places);
});

app.get('/restaurants', async (request, response) => {
    // let searchQuery = request.query.searchQuery; //**final queery */
    let searchQuery = 'miami'
    let places = await getRestaurantForCity(searchQuery, process.env.TRIP_ADVISOR_API_KEY);
    response.status(201).send(places);
});


// Route that runs our bookHandler functions that was imported in
app.get('/places', crudPlaces.getPlaces);
app.post('/places', crudPlaces.addPlaces);
app.delete('/places/:id', crudPlaces.deletePlaces)
app.put('/places/:id', crudPlaces.updatePlaces)

// class Place {
//     constructor(place) {
//         this.location_id = place.location_id;
//         this.name = place.name;
//         this.description = place.description;
//         this.address = place.address_obj.address_string;
//         this.image_url = place.images;
//     }
// }

// // *** Getting places for city ***//

// app.get('/city', async(request, response) => {
//     // let searchQuery = request.query.searchQuery; //**final queery */
//     let searchQuery = 'boston'

//     if (!searchQuery) {
//         response.status(400).send('bad request');
//     }

//     let urlApi = `https://us1.locationiq.com/v1/search?key=${process.env.REACT_APP_LOCATIONIQ_KEY}&q=${searchQuery}&format=json`
//     let responseApi = await axios.get(urlApi);
//     let lat = (responseApi.data[0].lat)
//     let lon = (responseApi.data[0].lon)
//     console.log(lat, lon)

//     let attractionPlacesUrl = `https://api.content.tripadvisor.com/api/v1/location/nearby_search?latLong=${lat}%2C${lon}&key=${API}&category=attractions&language=en`
//         // let attractionPlacesUrl = 'https://api.content.tripadvisor.com/api/v1/location/nearby_search?latLong=25.7741728%2C-80.19362&key=FE7C52E3BA0B4501A6ABD6240663C0A2&category=attractions&language=en'
//         // console.log(attractionPlacesUrl2)
//         // console.log(attractionPlacesUrl)


//     let placesResponse = await axios.get(attractionPlacesUrl);
//     if (placesResponse) {
//         let res = []
//         for (let index = 0; index < placesResponse.data.data.length; index++) {
//             const constUpdatedPlace = placesResponse.data.data[index];
//             const placeId = constUpdatedPlace.location_id
//             let locationDetailsUrl = `https://api.content.tripadvisor.com/api/v1/location/${placeId}/details?key=${API}&language=en&currency=USD`
//             const placeDetails = await axios.get(locationDetailsUrl);
//             if (placeDetails) {
//                 constUpdatedPlace["description"] = placeDetails.data.description
//                 constUpdatedPlace["address"] = placeDetails.data.address_obj.address_string
//             }
//             // image

//             let imagesUrl = `https://api.content.tripadvisor.com/api/v1/location/${placeId}/photos?key=${API}&language=en`
//             let imagesResponse = await axios.get(imagesUrl);
//             if (imagesResponse) {
//                 constUpdatedPlace["images"] = imagesResponse.data.data.map(obj => obj.images.large.url)
//             }

//             res.push(constUpdatedPlace)
//         }
//         let finalRes = res.map(place => new Place(place))
//         response.status(201).send(finalRes)
//     } else {
//         response.status(204).send('places not found');
//     }
// })


//error handler middleware



app.use((err, req, res, next) => res.status(500).send(err.message));



app.listen(PORT, () => console.log(`listening on ${PORT}`));
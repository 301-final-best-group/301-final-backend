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
app.get('/', (req, res) => res.status(200).send('Default Route Working'));

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

app.get('/city', async(request, response) => {
    // let searchQuery = request.query.searchQuery; //**final queery */
    let searchQuery = 'paris'

    if (!searchQuery) {
        response.status(400).send('bad request');
    }
    let placesUrl = `https://api.content.tripadvisor.com/api/v1/location/search?key=${API}&searchQuery=${searchQuery}&language=en`
    let placesResponse = await axios.get(placesUrl);
    if (placesResponse) {
        let res = []
        for (let index = 0; index < placesResponse.data.data.length; index++) {
            const constUpdatedPlace = placesResponse.data.data[index];
            const placeId = constUpdatedPlace.location_id
            let locationDetailsUrl = `https://api.content.tripadvisor.com/api/v1/location/${placeId}/details?key=${API}&language=en&currency=USD`
            const placeDetails = await axios.get(locationDetailsUrl);
            if (placeDetails) {
                constUpdatedPlace["description"] = placeDetails.data.description
                constUpdatedPlace["address"] = placeDetails.data.address_obj.address_string
            }
            // image

            let imagesUrl = `https://api.content.tripadvisor.com/api/v1/location/${placeId}/photos?key=${API}&language=en`
            let imagesResponse = await axios.get(imagesUrl);
            if (imagesResponse) {
                constUpdatedPlace["images"] = imagesResponse.data.data.map(obj => obj.images.large.url)
            }
            res.push(constUpdatedPlace)
        }
        // console.log("response", res)
        response.status(201).send(res)
    } else {
        response.status(204).send('places not found');
    }
})

// app.get('/images', async(request, response) => {
//     // let searchQuery = request.query.searchQuery; //**final queery */
//     let searchQuery = 'london'
//     if (!searchQuery) {
//         response.status(400).send('bad request');
//     }
//     let imagesUrl = `https://api.content.tripadvisor.com/api/v1/location/1050677/photos?key=${API}&language=en`
//     let imagesResponse = await axios.get(imagesUrl);
//     if (imagesResponse) {
//         let imagesArr = imagesResponse.data.data.map(obj => obj.images.large.url)
//         response.status(201).send(imagesArr)
//     } else {
//         response.status(204).send('place not found');
//     }
// })

//** getting description for the location by ID
// app.get('/locationdetails', (request, response)=> {
// const locationDetails = {
//   method: 'GET',
//   url: `https://api.content.tripadvisor.com/api/v1/location/1050677/details?key=${API}&language=en&currency=USD`,
//   headers: {accept: 'application/json'}
// };
// axios
//   .request(locationDetails)
//   .then(function (response) {
//     console.log(response.data.location_id);
//   })
//   .catch(function (error) {
//     console.error(error);
//   });
// })

// app.get('/locationdetails', async(request, response) => {
//     // let searchQuery = request.query.searchQuery; //**final queery */
//     let searchQuery = 'london'
//     if (!searchQuery) {
//         response.status(400).send('bad request');
//     }
//     let locationDetailsUrl = `https://api.content.tripadvisor.com/api/v1/location/123109/details?key=${API}&language=en&currency=USD`
//     let locationDetailsResponse = await axios.get(locationDetailsUrl);
//     if (locationDetailsResponse) {
//         let locationDetailsArr = locationDetailsResponse.data
//         response.status(201).send(locationDetailsArr)
//     } else {
//         response.status(204).send('place not found');
//     }
// })



//** getting images for the location by ID
// app.get('/images', async (request, response)=> {
// const locationImg = {
//   method: 'GET',
//   url: `https://api.content.tripadvisor.com/api/v1/location/154995/photos?key=${API}&language=en`,
//   headers: {accept: 'application/json'}
// };
// await axios
//   .request(locationImg)
//   .then(function (response) {
//     let imagesArr = locationImg.data.data.map(obj => obj.images.large.url)
//     response.status(201).send(imagesArr);
//   })
//   .catch(function (error) {
//     console.error(error);
//   });
// })

// app.get('/images', async(request, response) => {
//     // let searchQuery = request.query.searchQuery; //**final queery */
//     let searchQuery = 'london'
//     if (!searchQuery) {
//         response.status(400).send('bad request');
//     }
//     let imagesUrl = `https://api.content.tripadvisor.com/api/v1/location/1050677/photos?key=${API}&language=en`
//     let imagesResponse = await axios.get(imagesUrl);
//     if (imagesResponse) {
//         let imagesArr = imagesResponse.data.data.map(obj => obj.images.large.url)
//         response.status(201).send(imagesArr)
//     } else {
//         response.status(204).send('place not found');
//     }
// })








//error handler middleware
app.use((err, req, res, next) => res.status(500).send(err.message));



app.listen(PORT, () => console.log(`listening on ${PORT}`));
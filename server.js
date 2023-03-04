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

class Place {
    constructor(place) {
        this.location_id = place.location_id;
        this.name = place.name;
        this.description = place.description;
        this.address = place.address_obj.address_string;
        this.image_url = place.images;
    }
}

// *** Getting places for city ***//

app.get('/city', async(request, response) => {
    // let searchQuery = request.query.searchQuery; //**final queery */
    let searchQuery = 'miami'

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
        let finalRes = res.map(place => new Place(place))
        response.status(201).send(finalRes)
    } else {
        response.status(204).send('places not found');
    }
})




//error handler middleware
app.use((err, req, res, next) => res.status(500).send(err.message));



app.listen(PORT, () => console.log(`listening on ${PORT}`));
const axios = require('axios');

class Place {
    constructor(place) {
        this.location_id = place.location_id;
        this.name = place.name;
        this.description = place.description;
        this.address = place.address_obj.address_string;
        this.images = place.images;
    }
}
async function getPlacesForCity(searchQuery, apiKey) {
    try {
        if (!searchQuery) {
            throw new Error('bad request');
        }

        let urlApi = `https://us1.locationiq.com/v1/search?key=${process.env.REACT_APP_LOCATIONIQ_KEY}&q=${searchQuery}&format=json`
        let responseApi = await axios.get(urlApi);
        let lat = (responseApi.data[0].lat)
        let lon = (responseApi.data[0].lon)

        let attractionPlacesUrl = `https://api.content.tripadvisor.com/api/v1/location/nearby_search?latLong=${lat}%2C${lon}&key=${apiKey}&category=attractions&language=en`

        let placesResponse = await axios.get(attractionPlacesUrl);
        if (placesResponse) {
            let res = []
            for (let index = 0; index < placesResponse.data.data.length; index++) {
                const constUpdatedPlace = placesResponse.data.data[index];
                const placeId = constUpdatedPlace.location_id
                let locationDetailsUrl = `https://api.content.tripadvisor.com/api/v1/location/${placeId}/details?key=${apiKey}&language=en&currency=USD`
                let imagesUrl = `https://api.content.tripadvisor.com/api/v1/location/${placeId}/photos?key=${apiKey}&language=en`
                const [placeDetails, imagesResponse] = await Promise.all([
                    axios.get(locationDetailsUrl),
                    axios.get(imagesUrl)
                ]);
                if (placeDetails) {
                    constUpdatedPlace["description"] = placeDetails.data.description
                    constUpdatedPlace["address"] = placeDetails.data.address_obj.address_string
                }
                if (imagesResponse) {
                    constUpdatedPlace["images"] = imagesResponse.data.data.map(obj => obj.images.large.url)
                }
                res.push(constUpdatedPlace)
            }
            let finalRes = res.map(place => new Place(place))
            return finalRes
        } else {
            throw new Error('places not found');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}


async function getRestaurantForCity(searchQuery, apiKey) {
    try {
        if (!searchQuery) {
            throw new Error('bad request');
        }

        let urlApi = `https://us1.locationiq.com/v1/search?key=${process.env.REACT_APP_LOCATIONIQ_KEY}&q=${searchQuery}&format=json`
        let responseApi = await axios.get(urlApi);
        let lat = (responseApi.data[0].lat)
        let lon = (responseApi.data[0].lon)

        let attractionPlacesUrl = `https://api.content.tripadvisor.com/api/v1/location/nearby_search?latLong=${lat}%2C${lon}&key=${apiKey}&category=restaurants&language=en`

        let placesResponse = await axios.get(attractionPlacesUrl);
        if (placesResponse) {
            let res = []
            for (let index = 0; index < placesResponse.data.data.length; index++) {
                const constUpdatedPlace = placesResponse.data.data[index];
                const placeId = constUpdatedPlace.location_id
                let locationDetailsUrl = `https://api.content.tripadvisor.com/api/v1/location/${placeId}/details?key=${apiKey}&language=en&currency=USD`

                // Execute the third and fourth API calls in parallel using Promise.all
                let [placeDetails, imagesResponse] = await Promise.all([
                    axios.get(locationDetailsUrl),
                    axios.get(`https://api.content.tripadvisor.com/api/v1/location/${placeId}/photos?key=${apiKey}&language=en`)
                ]);
                
                if (placeDetails) {
                    constUpdatedPlace["description"] = placeDetails.data.description
                    constUpdatedPlace["address"] = placeDetails.data.address_obj.address_string
                }
                if (imagesResponse) {
                    constUpdatedPlace["images"] = imagesResponse.data.data.map(obj => obj.images.large.url)
                }

                res.push(constUpdatedPlace)
            }
            let finalRes = res.map(place => new Place(place))
            return finalRes
        } else {
            throw new Error('places not found');
        }
    } catch (error) {
        console.error(error);
        throw new Error('Error getting restaurant places');
    }
}

module.exports = { getPlacesForCity, getRestaurantForCity };
'use strict'

// Bringing in mongoose lib
const mongoose = require('mongoose');

// Deconstructing Schema out of mongoose
const { Schema } = mongoose;

// Creating new Schema that our Model with adhere to
const placeSchema = new Schema({
    location_id: String,
    name: String,
    description: String,
    street: String,
    images: [String],
    address: String,
    email: String,
    notes: String
})

// Exporting Model with name and Schema
module.exports = mongoose.model('Place', placeSchema);

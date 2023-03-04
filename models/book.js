'use strict'

// Bringing in mongoose lib
const mongoose = require('mongoose');

// Deconstructing Schema out of mongoose
const { Schema } = mongoose;

// Creating new Schema that our Model with adhere to
const bookSchema = new Schema({
    name: String,
    description: String,
    street: String,
    imagesUrl: Link,
    email: String
})

// Exporting Model with name and Schema
module.exports = mongoose.model('Book', bookSchema);
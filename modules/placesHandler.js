'use strict';

const placesModel = require('../models/placesModel');

const crudPlaces = {};

crudPlaces.addPlaces = async (req, res, next) => {
  try {
    placesModel.create(req.body)
    .then(createdPlace => res.send(createdPlace))
  } catch (e) { next(e.message); }
};

crudPlaces.getPlaces = async (req, res) => {
  try{
  const items = await placesModel.find({});
  res.status(200).json(items);
  }catch (e) {
    next(e.message);
  }
};

crudPlaces.updatePlaces = async (req, res) => {
  const id = req.params.id;
  placesModel.findByIdAndUpdate(id, req.body, {new: true})
  .then(updatedPlace => res.status(200).send(updatedPlace))
  .catch(error => next(error)) 
  // const items = await placesModel.find({ _id: id });
  // res.status(200).json(items[0]);
};

crudPlaces.deletePlaces = async (req, res) => {
  const id = req.params.id;
  const item = await placesModel.findByIdAndDelete(id)
  res.status(200).send(`Deleted ${item}`)
}


module.exports = crudPlaces;
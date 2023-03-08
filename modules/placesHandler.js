'use strict';

const placesModel = require('../models/placesModel');

const crudPlaces = {};

crudPlaces.addPlaces = async (req, res, next) => {
  try {
    const createdPlace = await placesModel.create(req.body);
    res.send(createdPlace);
  } catch (e) {
    next(e.message);
  }
};

crudPlaces.getPlaces = async (req, res, next) => {
  try {
    const items = await placesModel.find({});
    res.status(200).json(items);
  } catch (e) {
    next(e.message);
  }
};

crudPlaces.updatePlaces = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedPlace = await placesModel.findByIdAndUpdate(id, req.body, {new: true});
    res.status(200).send(updatedPlace);
  } catch (error) {
    next(error);
  }
};

crudPlaces.deletePlaces = async (req, res, next) => {
  try {
    const id = req.params.id;
    const item = await placesModel.findByIdAndDelete(id);
    res.status(200).send(`Deleted ${item}`);
  } catch (error) {
    next(error);
  }
};

module.exports = crudPlaces;
// 'use strict';

// const placesModel = require('../models/placesModel');

// const crudPlaces = {};

// crudPlaces.addPlaces = async (req, res, next) => {
//   try {
//     placesModel.create(req.body)    //TODO:  for Auth0 to replace !!! placesModel.create({...req.body, email:req.user.email})   !!! 3/4
//     .then(createdPlace => res.send(createdPlace))
//   } catch (e) { next(e.message); }
// };

// crudPlaces.getPlaces = async (req, res) => {
//   try{
//   const items = await placesModel.find({}); //TODO: to replace with !!! const items = await placesModel.find({email: req.user.email});!!! 4/4
//   res.status(200).json(items);
//   }catch (e) {
//     next(e.message);
//   }
// };

// crudPlaces.updatePlaces = async (req, res) => {
//   const id = req.params.id;
//   placesModel.findByIdAndUpdate(id, req.body, {new: true})
//   .then(updatedPlace => res.status(200).send(updatedPlace))
//   .catch(error => next(error)) 
//   // const items = await placesModel.find({ _id: id });
//   // res.status(200).json(items[0]);
// };

// crudPlaces.deletePlaces = async (req, res) => {
//   const id = req.params.id;
//   const item = await placesModel.findByIdAndDelete(id)
//   res.status(200).send(`Deleted ${item}`)
// }


// module.exports = crudPlaces;
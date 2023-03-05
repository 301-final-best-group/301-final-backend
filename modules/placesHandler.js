'use strict';

const placesSchema = require('../models/placesSchema');

const crudPlaces = {};

crudPlaces.addPlaces = async (req, res, next) => {
  try {
    placesSchema.create(req.body)
    .then(createdPlace => res.send(createdPlace))
    // const data = req.body;
    // const item = new placesSchema(data);
    // await item.save();
    // res.status(200).json(item);
  } catch (e) { next(e.message); }
};

crudPlaces.getPlaces = async (req, res) => {
  const items = await ItemModel.find({});
  res.status(200).json(items);
};

// crudPlaces.updatePlaces = async (req, res) => {
//   const id = req.params.id;
//   const items = await ItemModel.find({ _id: id });
//   res.status(200).json(items[0]);
// };

// crudPlaces.deletePlaces = async (req, res) => {
//   const id = req.params.id;
//   const item = await ItemModel.findByIdAndDelete(id)
//   res.status(200).send(`Deleted ${item}`)
// }


module.exports = crudPlaces;
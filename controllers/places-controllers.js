const {v4:uuidv4}= require('uuid');
const HttpError = require('../models/http-error');
const express= require ('express');
const mongoose=require('mongoose')

const { validationResult } = require('express-validator');
//const getCoordsForAddress= require('../util/location');
const BusStop = require('../models/place');
const User= require('../models/user');

let INITIAL_DATA = [
    {
        id: "p1",
        title: "Samoa Stop",
        description: "My first bus stop in Lima",
        //location: {
           // lat: 40.1382,
           // lng:-23.23
       // },
        address: "Av. La Molina interseccion con calle Samoa",
        busrespect: "yes",
        creator: "u1"
        }
];

const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid // Accessing the p1 in pid URL scrapping {pid:'p1'}  
    
    let bus_stop;
    try {
      bus_stop= await BusStop.findById(placeId)
    } catch (erro) {
      const error = new HttpError("Could not find the specified bus stop", 500);
      return next(error);
    }

    if (!bus_stop) {
      const error= new HttpError('No bus stop found for the provided ID.', 404);
      console.error(bus_stop)
      return next(error); 
    }
  
    res.json({bus_stop: bus_stop.toObject({getters: true })});
  };

const getPlacesByCreatorId = async (req, res, next)=> {
    const creatorId = req.params.uid;
    
    let bus_stops;
    try {
      bus_stops = await BusStop.find({creator: creatorId})
    } catch (erro) {
      const error = new HttpError("Could not find the specified creatorId", 500);
      return next(error);
    }
    if (!bus_stops || bus_stops.length===0) {
        return next(
          new HttpError('Could not find bus stops for the provide user id', 404)
          );
    }

    res.json({bus_stops: bus_stops.map(bus_stops => bus_stops.toObject({getters:true}))});
};

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return next(new HttpError ('Invalid bus stop please check your data', 422));
    }
    const { title, description, busrespect, address, creator } = req.body;
     
// Initial way of saving in database without too much problem
const createdPlace = new BusStop({
  title,
  description,
  busrespect,
  address,
  creator
});

let user;
try {
  user = await User.findById(creator);
} catch (err) {
  const error = new HttpError('Creating place failed, please try again', 500);
  return next(error);
}

if (!user) {
  const error = new HttpError('Could not find user for provided id', 404);
  return next(error);
}

console.log(user);

try {
  const sess = await mongoose.startSession();
  sess.startTransaction();
  await createdPlace.save({ session: sess });
  user.places.push(createdPlace);
  await user.save({ session: sess });
  await sess.commitTransaction();
} catch (err) {
  const error = new HttpError(
    'Incorrect creatorId. Please try again.',
    500
  );
  return next(error);
}

res.status(201).json({bus_stop: createdPlace });
};
  
    //would erase coordinates because would be replaced with the coordinates found using the geocoding API
    
   // Failed connection with geocoding (will have to update)
   //let coordinates;
    //try {
     //   coordinates= await getCoordsForAddress(address)
    //} 
    //catch (error) { //to prevent function to continue use return
    //   return next(error);
    //

  const updatePlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        console.log(errors);
        throw new HttpError ("Invalid inputs passed, please check your data ", 422);
    };

    const { title, description } = req.body;
    const placeId = req.params.pid;
  
    let bus_stop;
    try {
      bus_stop = await BusStop.findById(placeId)
    } catch (erro) {
      const error = new HttpError("Updating bus stop is not possible. Try again later.", 500);
      return next(error);
    }

    bus_stop.title = title
    bus_stop.description = description;

    try {await bus_stop.save();
    } catch (erro) {
      const error = new HttpError("Failure saving the document in the database. Verify connection.", 500);
      return next(error);
    }
  
    res.status(200).json({bus_stop: bus_stop.toObject({getters:true})});
  };

const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;

    let bus_stop;
    try {
      bus_stop = await BusStop.findById(placeId).populate('creator');
    } catch (err) {
      const error = new HttpError('Bus stop could not be deleted. Try again later. ', 500);
      return next(error);
    }

    if (!bus_stop) {
      const error = new HttpError("No bus stop has this id. Try with a different id.", 404);
      return next(error);
    }

    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await BusStop.deleteMany({ session: sess });
      BusStop.creator.places.pull(BusStop);
      await BusStop.creator.save({ session: sess });
      await sess.commitTransaction();
    } catch (err) {
      console.error(err)
      const error = new HttpError(
        'Something went wrong, could not delete place.',
        500
      );
      return next(error);
    }
  
    res.status(200).json({ message: 'Deleted place.' });
  };
  
exports.getPlaceById= getPlaceById;
exports.getPlacesByCreatorId = getPlacesByCreatorId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;

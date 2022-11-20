const {v4:uuidv4}= require('uuid');
const HttpError = require('../models/http-error');
const express= require ('express');

const { validationResult } = require('express-validator');
//const getCoordsForAddress= require('../util/location');
const BusStop = require('../models/place');


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
     
    try {
        const createdbusstop= await BusStop.create({
         title:title,
         description: description,
         busrespect:busrespect,
         address: address,
         creator: creator
       });
       res.send({bus_stop: createdbusstop});
     } catch(error) {
      console.error(error);
       res.send({status:"error caught"});
     }
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
      bus_stop = await BusStop.findById(placeId)
    } catch (err) {
      const error = new HttpError('Bus stop could not be deleted. Try again later. ', 500);
      return next(error);
    }

    try { 
      await bus_stop.remove()
    } catch (err) {
      const error = new HttpError('Bus stop could not be deleted in database. Try again later. ', 500);
      return next(error);
    }
    res.status(200).json({message: 'Deleted Bus Stop'});
};

  
exports.getPlaceById= getPlaceById;
exports.getPlacesByCreatorId = getPlacesByCreatorId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;

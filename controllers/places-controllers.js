
const HttpError = require('../models/http-error');

const { validationResult } = require('express-validator');
//const getCoordsForAddress= require('../util/location');
const Place = require('../models/place');

let INITIAL_DATA = [
    {
        id: "p1",
        title: "Samoa Stop",
        description: "My first bus stop in Lima",
        location: {
            lat: 40.1382,
            lng:-23.23
        },
        address: "Av. La Molina interseccion con calle Samoa",
        busrespect: "yes",
        creator: "u1"
        }
];




const getPlaceById = (req, res, next) => {
    const placeId = req.params.pid // Accessing the p1 in pid URL scrapping {pid:'p1'}  
    const place= INITIAL_DATA.find(p => { //find method goes over each element in the array, the argument p represents the element where find loop is
      return p.id ===placeId
    });
  
    if (!place) {
      const error= new HttpError('No bus stop found for the provided ID.', 404);
      throw error; 
  
    }
  
    res.json({place: place});
  };

const getPlacesByCreatorId = (req, res, next)=> {
    const userId = req.params.uid;

    const places = INITIAL_DATA.filter(p=>{ //filter to retrieve multiple places, not only the first one
        return p.creator ===userId;
    });
    
    if (!places || places.length===0) {
        return next(
          new HttpError('Could not find bus stops for the provide user id', 404)
          );
    }

    res.json({places});
};

const createPlace = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return next(new HttpError ('Invalid bus stop please check your data', 422));
    }


    const { title, description, busrespect, address, creator } = req.body; //erased location for now.
    //would erase coordinates because would be replaced with the coordinates found using the geocoding API
    
   // Failed connection with geocoding (will have to update)
   //let coordinates;
    //try {
     //   coordinates= await getCoordsForAddress(address)
    //} 
    //catch (error) { //to prevent function to continue use return
    //   return next(error);
    //}
    
    const createdPlace = new Place({
      title,
      description,
      address,
      //location
      busrespect,
      creator
    });


    //First connection to DATABASE
    try { 
      await createdPlace.save();}
    catch (err) {
      const error = new HttpError('Bus stop failed. Please try again.', 500
      );
      return next(error);
    } 
  
    res.status(201).json({place: createdPlace});
  };

  const updatePlace = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        console.log(errors);
        throw new HttpError ("Invalid inputs passed, please check your data ", 422);
    };

    const { title, description } = req.body;
    const placeId = req.params.pid;
  
    const updatedPlace = { ...INITIAL_DATA.find(p => p.id === placeId)};
    const placeIndex = INITIAL_DATA.findIndex(p => p.id === placeId);
    updatedPlace.title = title;
    updatedPlace.description = description;
  
    INITIAL_DATA[placeIndex] = updatedPlace;
  
    res.status(200).json({place: updatedPlace});
  };

const deletePlace = (req, res, next) => {
    const placeId = req.params.pid;
    if (!INITIAL_DATA.find(p=> p.id ===placesId))
       throw new HttpError('Could not find a bus stop for that ID ')

    INITIAL_DATA = INITIAL_DATA.filter(p=> p.id !== placeId)
    res.status(200).json({message: 'Deleted Place'});
};

  
exports.getPlaceById= getPlaceById;
exports.getPlacesByCreatorId = getPlacesByCreatorId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;

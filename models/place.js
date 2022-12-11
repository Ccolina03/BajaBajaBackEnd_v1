const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const placeSchema = new Schema({
    title: {
      type: String
    },
    description: {
      type: String
    },
    address: {
      type: String
    }, 
    busrespect: {
      type: String
    },
    image: { type: String, required: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    creator: {
      type: mongoose.Types.ObjectId, required: true, ref: 'User'
    }
},
)

const BusStop = mongoose.model('BusStop', placeSchema)

module.exports= BusStop
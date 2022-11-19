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
    creator: {
      type: String
    }
}
);

const BusStop = mongoose.model('BusStop', placeSchema)

module.exports= BusStop
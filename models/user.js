const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name1: {
      type: String, required: true
    },
    email: {
      type: String, required: true, unique: true
    },
    password: {
      type: String, required: true, minlength: 5
    }, 
    places: {
      type: String, required: true
    }
    //future busrespect karma which will indicate the amount of busrespect you have indicated.
}
);

userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema)

module.exports= User
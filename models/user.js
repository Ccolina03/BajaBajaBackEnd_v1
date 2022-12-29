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

    places: [{
      type: mongoose.Types.ObjectId, required: true, ref: 'BusStop'
    }],

    //Could try put karma here and indicate there that that busrespect can only have one karma, but karma can have many busrespect.
    //future busrespect karma which will indicate the amount of busrespect you have indicated.
}
);

userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema)

module.exports= User

const {validationResult}=require('express-validator');
const HttpError = require("../models/http-error");
const User = require('../models/user');


const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (erro) {
    const error = new HttpError(
      'Displaying users failed. Try again later.',
      500
    );
    return next(error);
  }
  res.json({users: users.map(user => user.toObject({ getters: true }))});
};

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error(errors);
      return next(
        new HttpError('Invalid inputs. Try again', 422)
      );
    }
    const { name1 , email, password} = req.body;
  
    let existingUser;
    try {
      existingUser = await User.findOne({ email: email })
    } catch (err) {
      const error = new HttpError(
        'Signing up failed, please try again later.',
        500
      );
      return next(error);
    }

    if (existingUser) {
      const error = new HttpError (
          'User exists already. Please use another email.', 422);
          return next(error);
      }

//if existing user is not true then: 

try {
    const createdUser= await User.create({
        name1,
        email,
        password, 
        places: []
    });        
        
    res.status(201).json({user: createdUser.toObject({getters: true})});
         } catch (erro) {
            const error = new HttpError("Saving the created user in the database has failed. Verify connection.", 500);
            return next(error);
          };
}

const login = async (req, res, next) => {
    const {email, password} = req.body;
    
    let existingUser;
    try {
      existingUser = await User.findOne({ email: email })
    } catch (err) {
      const error = new HttpError(
        'Login failed, please try again later.',
        500
      );
      return next(error);
    }

    if (!existingUser || existingUser.password !== password) {
      const error = new HttpError(
        'Invalid credentials, could not log you in.',
        401
      );
      return next(error);
    }
    
    res.json({message:"Logged In", user: existingUser.toObject({getters:true})})
};

exports.getUsers= getUsers;
exports.signup=signup;
exports.login=login;

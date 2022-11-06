const {v4:uuidv4}= require('uuid');
const {validationResult}=require('express-validator');

const HttpError = require("../models/http-error")

const INITIAL_DATA=[
    {
        id:'u1',
        name:"Carlos Colina",
        email: "cmcolina@ualberta.ca",
        password: "barcel0na"

    }
]



const getUsers = (req, res, next) => {
    res.json({users: INITIAL_DATA})
};

const signUp = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        console.log(errors);
        throw new HttpError ("Invalid inputs passed, please check your data ", 422);
    };
    
    const { name, email, password} = req.body;

    const hasUser = INITIAL_DATA.find(usuario => usuario.email ===email);
    if (hasUser) {
    throw new HttpError("Could not create user, email already exists", 422);
    }


    const createdUser={
        id:uuidv4(),
        name,
        email,
        password
    };

    INITIAL_DATA.push(createdUser);

    res.status(201).json({user:createdUser})

};

const login = (req, res, next) => {
    const {email, password} = req.body;
    
    const identifiedUser = INITIAL_DATA.find(usuario => usuario.email===email); //to find the specific dictionary with corresponding email

    if (!identifiedUser|| identifiedUser.password !=password) {
        throw new HttpError("No user found, credentials are wrong. Try again.")

    }
    res.json({message:"Logged IN"})
};

exports.getUsers= getUsers;
exports.signUp=signUp;
exports.login=login;


const express= require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes")
const HttpError = require ("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => { 
    const error= new HttpError('Route not available. Try something different?', 404);
    throw ( error);
});

app.use((error, req, res, next) =>{
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500)
    res.json({message: error.message || "An unknown error occured! Sorry" });
});

//Connection mongoose with backend
mongoose.connect("mongodb+srv://BajaBaja1:ccolina03@cluster0.8iyrogp.mongodb.net/places?retryWrites=true&w=majority").then(()=>{
    app.listen(4000);
}).catch(err => {
    console.log(err)
}); 
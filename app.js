
const express= require('express');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes")

const HttpError = require ("./models/http-error");
const app = express();

app.use(bodyParser.json());

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes)

app.use((req, res, next) => { 
    const error= new HttpError('Route not available. Try something different?', 404);
    throw error;
});

app.use((error, req, res, next) =>{
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500)
    res.json({message: error.message || "An unknown error occured! Sorry" });
});


url = 'mongodb+srv://peruano:boliviano@cluster0.8iyrogp.mongodb.net/mern?retryWrites=true&w=majority'

mongoose.connect(url, {useNewUrlParser: true}).then(()=>{
    console.log("Connected to database")
    app.listen(5000);
}).catch(erro => {
    console.log(erro)
});




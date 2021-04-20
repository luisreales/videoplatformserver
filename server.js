
require('dotenv').config();
const express = require('express');
//enable cors
const cors = require("cors");

const morgan = require('morgan');
//configuracion de aws
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const uuid = require('uuid').v4;
const MongoClient = require('mongodb').MongoClient;
const path = require('path');

//configuracion del ffmpeg para extraer los thumbnails
const ffmpeg = require('fluent-ffmpeg');

//configuracion de la app con express

const app = express();

//habilitar los cors entre el front y el back

var corsOptions = {
    origin : 'http://localhost:3000'
}

app.use(cors(corsOptions));

//llamar a la bd de mongodb

require('./database');
app.use(express.static('public'));

//import rutas
const indexRoutes = require('./routes/index.routes');
const multer = require('multer');

//settings

app.set('port',process.env.PORT || 3000)
app.set('view',path.join(__dirname,'views'));
app.set('view engine', 'ejs');

//middleware

app.use(morgan('dev'));
//modulo urlencode poder entender los datos que le envian en el html
//necesario para guardar los datos

app.use(express.urlencoded({extended:false}));
// body-parser
app.use(express.json());

//routes
app.use('/',indexRoutes);


app.use(express.static('public'))
app.use(express.static('uploads'))


app.listen(app.get('port'), () =>{
    console.log(`Server on port ${app.get('port')}`);
})
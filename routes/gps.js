var express = require('express');
var router = express.Router();

//database connection
var mongojs = require('mongojs');
var db = mongojs('mongodb+srv://mihailo:mihailo@projekat-27hw2.mongodb.net/master?retryWrites=true&w=majority',['']);






router.post('/gps/post_gps_coordinates', function(req,res,next){
    console.log("koordinate:");
});
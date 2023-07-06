var express = require('express');
var router = express.Router();

//database connection
var mongojs = require('mongojs');
var db = mongojs('mongodb+srv://mihailo:mihailo@projekat-27hw2.mongodb.net/master?retryWrites=true&w=majority',['Rides']);


const jwt = require('jsonwebtoken');
const secret = 'secretKey';


// Verify a JWT
const verifyJWT = (token, secret) => {
    try {
      const decoded = jwt.verify(token, secret);
      return decoded;
    } catch (err) {
      return null;
    }
  };


  function requireAdminRole(userRole) {
    if(!userRole){
        return false
    }
    else{
        if (userRole === "admin") {
           return true;
        } else {
            return false;
        }
    }
  }


//insert ride
router.post('/rides', function(req,res,next){
    const authorization = req.headers.authorization;
    
    
        if (!authorization) {
            res.status(401).send({ error: 'No token provided' });
        }
        else{
            const token = authorization.split(' ')[1];
            jwt.verify(token, secret, (err, decoded) => {
                if (err) {
                    res.status(401).send({ error: 'Token is not valid' });
                } 
                else {

                    decoded = verifyJWT(token, secret);
                    

                        var ride = req.body;
                        db.rides.save(ride, function(err,ride){
                            if(err){
                                res.send(err);
                            }
                            res.json(ride);
                        });
                    
                }
            });
        }
    
});



//get all rides
router.get('/rides', function(req, res) {
    const authorization = req.headers.authorization;
    
    if (!authorization) {
        res.status(401).send({ error: 'No token provided' });
    }
    else{
        const token = authorization.split(' ')[1];
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                res.status(401).send({ error: 'Token is not valid' });
            } 
            else {
                decoded = verifyJWT(token, secret);
                if (!decoded) {
                    return res.status(401).send({ message: 'Unauthorized' });
                }

                

                    db.rides.find({},function(err, ride){
                        if(err){
                            res.send(err);
                        }
        
                        res.json(ride);
                    }); 
                
            }
        });
    }
});



//get rides by user
router.get('/rides/:username', function(req, res) {
    const authorization = req.headers.authorization;
    
    if (!authorization) {
        res.status(401).send({ error: 'No token provided' });
    }
    else{
        const token = authorization.split(' ')[1];
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                res.status(401).send({ error: 'Token is not valid' });
            } 
            else {
                decoded = verifyJWT(token, secret);
                if (!decoded) {
                    return res.status(401).send({ message: 'Unauthorized' });
                }

                

                    db.rides.find({user_id: req.params.username},function(err, ride){
                        if(err){
                            res.send(err);
                        }
        
                        res.json(ride);
                    }); 
                
            }
        });
    }
});



  module.exports = router;
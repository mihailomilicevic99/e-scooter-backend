var express = require('express');
var router = express.Router();

//database connection
var mongojs = require('mongojs');
var db = mongojs('mongodb+srv://mihailo:mihailo@projekat-27hw2.mongodb.net/master?retryWrites=true&w=majority',['Scooters']);


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


//get all scooters
router.get('/scooters', function(req, res) {
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

                userRole = decoded.role;

                
                    db.scooters.find({},function(err, scooter){
                        if(err){
                            res.send(err);
                        }
                        res.json(scooter);
                    }); 
                
                
            }
        });
    }
            
    

});


//get scooter with id
router.get('/scooters/:id', function(req, res) {
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


                db.scooters.find({id: parseInt(req.params.id,10)},function(err, scooter){
                    if(err){
                        res.send(err);
                    }
                    res.json(scooter);
                }); 
                
            }
        });
    }
            
    

});


//delete scooter with matching id
router.delete('/scooters/:id' ,function(req,res,next){
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

                userRole = decoded.role;

                if(!requireAdminRole(userRole)){
                    res.status(401).send({error: 'Not authorized'});
                }
                else{
                    let scooterId = req.params.id;
                    scooterId = parseInt(scooterId, 10);
                    db.scooters.remove({id: scooterId},function(err,scooter){
                        if(err){ 
                            res.send(err);
                        }
                        res.json(scooter);
                    });
                }
            }
        });
    }
});


//insert new scooter
router.post('/scooters', function(req,res,next){
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

                userRole = decoded.role;

                if(!requireAdminRole(userRole)){
                    res.status(401).send({error: 'Not authorized'});
                }
                else{
                    var scooter = req.body;
                    db.scooters.save(scooter, function(err,scooter){
                        if(err){
                            res.send(err);
                        }
                        res.json(scooter);
                    });
                }
            }
        })
    }
            
});


//reserve scooter with matching id
router.put('/scooters/reservation/:id' , function(req,res,next){
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


                    

                        let username = req.body.user.username;
                        let id = parseInt(req.params.id, 10);
                        
                        
                        var newvalues = { $set: { reservation_username: username, reserved: true, reservation_time: req.body.res_time } };
                        
                        db.scooters.update({id: id}, newvalues, function(err,scooter){
                            if(err){
                                res.send(err);
                            }
                            res.json(scooter);
                        });
                    
            }
        });
    }

});



//release scooter with matching id
router.put('/scooters/release/:id' , function(req,res,next){
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


                    

                        
                        let id = parseInt(req.params.id, 10);
                        
                        
                        var newvalues = { $set: { reservation_username: "", reserved: false , reservation_time: "" } };
                        
                        db.scooters.update({id: id}, newvalues, function(err,scooter){
                            if(err){
                                res.send(err);
                            }
                            res.json(scooter);
                        });
                    
            }
        });
    }

});



//update scooter coordinates
router.put('/scooters/gps' , function(req,res,next){

    let id = parseInt(req.body.id, 10);

    let newLat = req.body.lat;
    let newLong = req.body.long;
                        
                        
    var newvalues = { $set: { latitude: newLat, longitude: newLong } };
                        
    db.scooters.update({id: id}, newvalues, function(err,scooter){
        if(err){
            res.send(err);
        }
        res.json(scooter);
    });
});



//update scooter with matching id
router.put('/scooters/:id' , function(req,res,next){
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


                    

                        let id = parseInt(req.params.id, 10);
                        
                        
                        var newvalues = { $set: { number_of_rides: req.body.number_of_rides, total_time: req.body.total_time , inUse: req.body.inUse, driver_username: req.body.driver_username } };
                        
                        db.scooters.update({id: id}, newvalues, function(err,scooter){
                            if(err){
                                res.send(err);
                            }
                            res.json(scooter);
                        });
                    
            }
        });
    }

});



//insert or delete token
router.put('/scooters/token/:id' , function(req,res,next){
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


                    

                        let id = parseInt(req.params.id, 10);
                        
                        
                        var newvalues = { $set: { token: req.body } };
                        
                        db.scooters.update({id: id}, newvalues, function(err,scooter){
                            if(err){
                                res.send(err);
                            }
                            res.json(scooter);
                        });
                    
            }
        });
    }

});



//get token
router.get('/scooters/:id', function(req, res) {
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


                db.scooters.find({id: parseInt(req.params.id,10)},function(err, scooter){
                    if(err){
                        res.send(err);
                    }
                    res.json(scooter.token);
                }); 
                
            }
        });
    }
            
    

});



module.exports = router;
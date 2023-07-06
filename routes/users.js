var express = require('express');
var router = express.Router();

//database connection
var mongojs = require('mongojs');
var db = mongojs('mongodb+srv://mihailo:mihailo@projekat-27hw2.mongodb.net/master?retryWrites=true&w=majority',['Users']);


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




//get role of logged in user
router.get('/users/jwt/jwt/jwt', function(req,res,next){
    
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
                    res.send({ role: userRole });
            }
        });
    }
});




//insert new user
router.post('/users', function(req,res,next){
    const authorization = req.headers.authorization;
                var user = req.body;
                db.users.save(user, function(err,user){
                    if(err){
                        res.send(err);
                    }
                    res.json(user);
                });
            
});


//get user with matching username and password
router.get('/users/:username/:password', function(req,res,next){
    let username = req.params.username;
    
    db.users.find({username: req.params.username, password: req.params.password},function(err, user){
        if(err){
            res.status(401).send({ error: 'Incorrect email or password', user });
        }
        else{
            if(Object.keys(user).length == 0){
                res.send({ error: 'Incorrect email or password', user });
            }
            else{
                const role = user[0].role;
                const token = jwt.sign({ username, role}, secret, { expiresIn: '1h' });
                res.send({ message: 'Login successful', token, user });
            }
        }
        //res.json(user);
     });
            
});


//get all users
router.get('/users', function(req, res) {
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

                    db.users.find({},{password: 0},function(err, user){
                        if(err){
                            res.send(err);
                        }
        
                        res.json(user);
                    }); 
                }
            }
        });
    }
});



//check if user with matching email(username) exists
router.get('/users/:email', function(req,res,next){
    db.users.find({username: req.params.email},function(err, user){
        if(err){
            res.send(err);
        }
        if(Object.keys(user).length === 0) {
            res.json(false);
        }
        else{
            res.json(true);
        }
    }); 
});



//get role of logged in user
router.get('/users/jwt/jwt/jwt', function(req,res,next){
    
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
                    res.send({ userRole: userRole });
            }
        });
    }
});



//delete user with matching id
router.delete('/users/:username' ,function(req,res,next){
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
                    let username = req.params.username;
                    db.users.remove({username: username},function(err,user){
                        if(err){ 
                            res.send(err);
                        }
                        res.json(user);
                    });
                }
            }
        });
    }
});



//update user with matching id
router.put('/users/:username' , function(req,res,next){
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

                    

                        let username = req.params.username;
                        
                        if(req.body.name_and_surname != ""){
                            var newvalues = { $set: { name_and_surname: req.body.name_and_surname, 
                                                    password: req.body.password, 
                                                    reserved_scooter: req.body.reserved_scooter, 
                                                    isDriving: req.body.isDriving, 
                                                    driving_started_timestamp: req.body.driving_started_timestamp, 
                                                    driving_scooter: req.body.driving_scooter, 
                                                    balance: req.body.balance,
                                                    total_time: req.body.total_time,
                                                    number_of_rides: req.body.number_of_rides } };
                        }
                        else{ //just releasing scooter
                            var newvalues = {$set: {reserved_scooter: req.body.reserved_scooter}};
                        }

                        db.users.update({username: username}, newvalues, function(err,user){
                            if(err){
                                res.send(err);
                            }
                            res.json(user);
                        });
                    
            }
        });
    }

});


module.exports = router;
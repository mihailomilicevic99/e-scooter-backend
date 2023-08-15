var express = require('express');
var router = express.Router();

//database connection
var mongojs = require('mongojs');
var db = mongojs('mongodb+srv://mihailo:mihailo@projekat-27hw2.mongodb.net/master?retryWrites=true&w=majority',['Images']);

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const jwt = require('jsonwebtoken');
const secret = 'secretKey';






//insert image in database
router.post("/images/:id", upload.single("image"), (req, res) => {
  
    db.images.save({
      id: parseInt(req.params.id),
      name: req.file.originalname,
      data: new mongojs.Binary(req.file.buffer),
      contentType: req.file.mimetype
    }, (err, result) => {
      if (err) return res.status(500).send(err);
      res.json("Image uploaded successfully.");
    });
          
});
        


//get image with matching product id
router.get('/images/:id', function(req,res,next){
    let productId = req.params.id;
    productId = parseInt(productId, 10);
    db.images.findOne({id: productId},function(err, result){
        if(err){
            res.send(err);
        }
        if (!result) return res.status(404).send("Image not found.");

        // convert the BinData object to a buffer
        const buffer = Buffer.from(result.data.buffer);

        res.set({
          'Content-Type': result.contentType,
          'Content-Length': buffer.length
        });
        res.send(buffer);
    }); 
});




module.exports = router;
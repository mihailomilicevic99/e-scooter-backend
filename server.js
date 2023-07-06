var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
const ejs = require('ejs');


var index = require('./routes/index'); 
var users = require('./routes/users');
var images = require('./routes/images');
var scooters = require('./routes/scooters');
var rides = require('./routes/rides');


var port =  3000;


var app = express();



//view Engine
app.set('views',path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);


app.use(express.static('./dist/webshop'));



app.use(bodyParser.json());


var cors = require('cors');
app.use(cors());

app.use('/', index );
app.use('/api', users);
app.use('/api', images);
app.use('/api', scooters);
app.use('/api', rides);


app.listen(port, function(){
    console.log('Server started on port' + port);
});

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
//const ejs = require('ejs');


var index = require('./routes/index'); 
var users = require('./routes/users');
var gps = require('./routes/gps');
var scooters = require('./routes/scooters');
var rides = require('./routes/rides');


var port =  process.env.PORT || 3000;


var app = express();


app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
    //res.sendFile(path.join(__dirname, 'src/app/login/login.component.html'));
    });



//view Engine
app.set('views',path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);


app.use(express.static(path.join(__dirname,'project')));
//app.use(express.static('./dist/webshop'));



app.use(bodyParser.json());


var cors = require('cors');
app.use(cors());

app.use('/', index );
app.use('/api', users);
//app.use('/api', gps);
app.use('/api', scooters);
app.use('/api', rides);


app.listen(port, function(){
    console.log('Server started on port' + port);
});

var express =require('express');

var app = express();

var path = require('path');
var viewPath = path.join(__dirname, './views');

var session = require('express-session');
app.use(session({secret:'vamshi goud'}));

app.set('view engine', 'ejs');
app.set('views', viewPath);

app.use('/assets', express.static('assests'));
app.use('/assets/css',express.static(path.join(__dirname,'/./assets/css')));
app.use('/assets/images',express.static(path.join(__dirname,'/./assets/images')));

var ConnectionController = require('./controller/ConnectionController.js');
var profileController=require('./controller/ProfileController.js');
app.use('/',ConnectionController);
app.use('/',profileController);

app.listen(8003);

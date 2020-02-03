var express=require('express');
var router=express.Router();
var session = require('express-session');
var connectionDB= require('../util/connectionDB');
var userConnectionDB = require('../util/UserConnectionDB');
var bodyParser= require('body-parser');
var urlEncodedParser = bodyParser.urlencoded({extended: false});
var { check, validationResult } = require('express-validator');


router.get('/',function(request,response){
  response.render('index',{user:request.session.theUser});                         //renders the home page and saves the session
});

router.get('/index', function(request, response) {
    response.render('index',{user:request.session.theUser});                      //renders the home page and saves the session
});

router.get('/connections',async function(request, response) {
  var connections = await connectionDB.getConnections();
  var categories= await connectionDB.getuniqueCategories();
  response.render('connections',{data:connections,categories:categories,user:request.session.theUser});   //renders connections page data obtained from connection db categories dynamic everything stored in a session
});


router.get('/connection',async function(request,response){                                 //logic for rendering connection page dynamically
  var connectionId = request.query.connectionId;
    var user = request.session.theUser;

  if(connectionId !== undefined && connectionId !== null){
	  var result = await connectionDB.getConnection(connectionId);
    //console.log(result);
	  if(result != null  && user!=null && result.length != 0 && result[0].userID == user.userID){
		  response.render('connection',{result:result[0],user:user,modify:true});

    }else if(result != null  && result.length != 0 ){
      response.render('connection',{result:result[0],user:user,modify:false});
	  }else{
		  response.send('no Connection code is available');
	  }
  }else{
    var connections = await connectionDB.getConnections();
    var categories = await connectionDB.getuniqueCategories();
     response.render('connections',{data:connections,categories:uniqueCategories,user:request.session.theUser});
  }
});



router.get('/savedConnections',function(request,response){                 //renders saved connections
  response.render('savedConnections',{data:request.session.userProfile,user:request.session.theUser});
});

router.get('/newConnection',function(request,response){                   //renders new connection
  response.render('newConnection',{user:request.session.theUser,error:undefined,flag:false});
});


router.post('/newConnection',urlEncodedParser,[
  check('topic').matches(/^[a-z ]+$/i).withMessage('topic should only have alphabets'),
  check('name').isAlphanumeric().withMessage('Name should include only alphabets'),
  check('Details').isLength({ min: 3}).withMessage('Minimum length of details should be 3'),
  check('location').isLength({min:3}).withMessage('Minimum length of location should be 3'),
  check('Date').isLength({min:6}).withMessage('Minimum length of date should be 6'),
  check('time').matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Time format is invalid'),

], async function(request,response){
  var errors =validationResult(request);
  var user = request.session.theUser;
 if(!errors.isEmpty()){

   response.render('newConnection',{user:request.session.theUser,error:errors.array(),flag:false})
 }else if(user == null){
   response.render('newConnection',{user:request.session.theUser,error:undefined,flag:true})
 }else{
   await userConnectionDB.addingConnection(request.body,user);
  response.redirect('/connections');
}
});

router.get('/about',function(request,response){                            //renders about view
  response.render('about',{user:request.session.theUser});
});

router.get('/contact',function(request,response){                           //renders contact view
  response.render('contact',{user:request.session.theUser});
});



module.exports = router;

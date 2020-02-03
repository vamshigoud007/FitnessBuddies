var express=require('express');
var router=express.Router();
var session = require('express-session');
var bodyParser= require('body-parser');

var urlEncodedParser = bodyParser.urlencoded({extended: false});
var { check, validationResult } = require('express-validator');
var crypto = require('crypto');

var connectionDB = require('../util/connectionDB');
var userDB= require('../util/UserDB');
var UserConnection = require('../model/UserConnection');
var UserProfile = require('../model/UserProfile');


var userProfile;


router.get('/login',async function(request,response){
  response.render('login',{valid:false,error:undefined,user:undefined});
});

//login functionality logic where savedConnections is rendered

router.post('/login',urlEncodedParser,[
  check('EmailAddress').isEmail().withMessage('username should be an email'),
  check('Password').isLength({ min: 7, max: 20})
  .withMessage('Password should be between 7-20 characters long.')
  .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, 'i')
  .withMessage('Password should include lowercase,uppercase,number & special character.')
], async function(request,response){
   var errors =validationResult(request);
   if(!errors.isEmpty()){
     response.render('login',{valid:false,error:errors.array(),user:undefined})
   }else if(!request.session.theUser){
    var userName = request.body.EmailAddress;
    var Password = request.body.Password;

    var user = await userDB.getUserProfile(userName);
    if(user != null && user.Password == saltHashPassword(Password,user.salt)){

      request.session.theUser = user;
      userProfile = new UserProfile(user);
      var userConnections = await userProfile.addUserConnections(user.userID);
        //console.log(userConnections);
      userProfile.userconnectionlist= userConnections;
      request.session.userProfile = userProfile;
      //console.log(userProfile);
      response.render('savedConnections',{data:request.session.userProfile,user:request.session.theUser});
    }else{
      response.render('login',{valid:true,error:null,user:undefined});
    }
  }else{
    response.render('savedConnections',{data:request.session.userProfile,user:request.session.theUser});
  }
});


  router.get('/logout',function(request,response){
    if(request.session.theUser) {                  //logout funtionality where the session data is deleted and index page is rendered
   userProfile.emptyProfile();
   request.session.destroy();
   response.redirect('/');
 }else{
  response.redirect('/');
}

});


router.post('/savedConnections',urlEncodedParser, async function(request, response){
  //console.log("in post saved connections");
  //console.log(request.body.action);      //logic for update delete actions
  if(request.body.action == undefined)
  {
    response.render('savedConnections',{data:request.session.userProfile,user:request.session.theUser});
  }
  else if (request.session.theUser == undefined){
    response.render('index',{user:request.session.theUser});
  }

   else
   {
    var connectionId = request.query.connectionId;
    var RSVP = request.query.RSVP;
    var action = request.body.action;
    // console.log(connectionId);
     //console.log(request.query.RSVP);
     //console.log( request.body.action);
    var connection = await connectionDB.getConnection(connectionId);
     if(action == 'save')
     {
       //console.log("in save");
       var Connectionexisting = userProfile.existingconnections(connectionId);
       if(Connectionexisting == 0)
       {
        await userProfile.addingConnection(connection[0],RSVP);
        var userConnections = await userProfile.addUserConnections(request.session.theUser.userID);
        userProfile.userconnectionlist= userConnections;
         request.session.userProfile = userProfile;
        // console.log(userProfile);
         response.render('savedConnections',{data:request.session.userProfile,user:request.session.theUser});

       }
       else
       {
          var  userconnection = new UserConnection(connection[0],RSVP);
          await userProfile.updateConnection(userconnection,request.session.theUser.userID);
           var userConnections = await userProfile.addUserConnections(request.session.theUser.userID);
           userProfile.userconnectionlist= userConnections;

           request.session.userProfile = userProfile;
           response.render('savedConnections',{data:request.session.userProfile,user:request.session.theUser});
         }
       }
       else if(action == 'delete')
       {
          var Connectionexisting = userProfile.existingconnections(connectionId);

           if(Connectionexisting == 1)
           {
           await userProfile.removeConnection(connection[0]);
           var userConnections = await userProfile.addUserConnections(request.session.theUser.userID);
           userProfile.userconnectionlist= userConnections;
           request.session.userProfile= userProfile;
           response.render('savedConnections',{data:request.session.userProfile,user:request.session.theUser});
         }
         else{
               response.render('savedConnections',{data:request.session.userProfile,user:request.session.theUser});
             }
  }
 }
});


router.get('/signup',function(request,response){
 response.render('signup',{user:request.session.theUser,error:undefined});
});

router.post('/signup',urlEncodedParser,[
  check('userID').isAlphanumeric().withMessage('user id has to have alphabets and numbers'),
  check('FirstName').matches( /^[a-zA-Z ]*$/).withMessage('FirstName must be in alphabets'),
  check('LastName').matches(/^[a-zA-Z ]*$/).withMessage('LastName must be in alphabets'),
  check('EmailAddress').isEmail().withMessage('Enter valid Email'),
  check('Password').isLength({ min: 8, max: 20})
  .withMessage('Password must be between 8-20 characters long.')
  .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, 'i')
  .withMessage('Password must include lowercase,uppercase,number & special character.'),
  //check('Address1Field').matches( /^[a-zA-Z0-9]*$/).withMessage('Address should contain only alphabets and numbers'),
  //check('Address2Field').matches( /^[a-zA-Z0-9]*$/).withMessage('Address should contain only alphabets and numbers'),
  check('City').matches(/^[a-zA-Z ]*$/).withMessage('city should only have alphabets'),
  check('State').matches(/^[a-zA-Z ]*$/).withMessage('State should only have alphabets'),
  check('zipCode').isNumeric().withMessage('zipcode should only contain numbers'),
  check('Country').matches(/^[a-zA-Z ]*$/).withMessage('Country should only have alphabets'),
],async function(request,response){

   var errors =validationResult(request);
   if(!errors.isEmpty()){
     response.render('signup',{error:errors.array(),user:undefined})
   }else{
     var salt = getSalt();
     var hashPassword =saltHashPassword(request.body.Password,salt);
     var user = await userDB.addUser(request.body,hashPassword,salt);
     //console.log(request.session.theUser);
     request.session.theUser = user;
     userProfile = new UserProfile(user);
     userProfile.userconnectionlist= [];
     request.session.userProfile = userProfile;
     response.render('savedConnections',{data:request.session.userProfile,user:request.session.theUser});
 }
});

router.get('/update',async function(request,response){
  var connectionId = request.query.connectionId;
  var result = await connectionDB.getConnection(connectionId);
  response.render('updateConnection',{user:request.session.theUser,result:result,error:undefined})
})

router.post('/update',urlEncodedParser,[
  check('topic').matches(/^[a-z ]+$/i).withMessage('topic should only have alphabets'),
  check('name').isAlphanumeric().withMessage('Name should include only alphabets'),
  check('Details').isLength({ min: 3}).withMessage('Minimum length of details should be 3'),
  check('location').isLength({min:3}).withMessage('Minimum length of location should be 3'),
  check('Date').isLength({min:6}).withMessage('Minimum length of date should be 6'),
  check('time').matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Time format is invalid'),

],async function(request,response){

  var user = request.session.theUser;
  if(user != null){
    await connectionDB.updateCon(user.userID,request.body);
    response.redirect('/connections');
  }
})

router.post('/delete',urlEncodedParser,async function(request,response){
  var user = request.session.theUser;
  //console.log(user);
  var connectionId = request.query.connectionId;
  if(user != null && connectionId !=null ){
    await connectionDB.deleteCon(connectionId,user.userID);
    var userConnections = await userProfile.addUserConnections(user.userID);
    userProfile.userconnectionlist= userConnections;
    request.session.userProfile = userProfile;
    response.redirect('/connections');
  }
})

function saltHashPassword(Password,salt){
  var hash = crypto.createHmac('sha512', salt);
  hash.update(Password);
  var hashPassword = hash.digest('hex');
  //console.log(Password);
  //console.log(hashPassword);
  //console.log(salt);
  //console.log("==============");


  return hashPassword;
}
function getSalt(){
  var salt = crypto.randomBytes(8).toString('hex') .slice(0,16);
  return salt;
}
router.get('/*',function(request,response){
    response.send('Invalid URL');
});

module.exports = router;

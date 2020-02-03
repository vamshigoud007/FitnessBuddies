var User = require('../model/User');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/milestone5', {useNewUrlParser: true});
var Schema = mongoose.Schema;


var userSchema = new Schema({
  userID: {type:String, required:true},
  FirstName: {type:String, required:true},
  LastName: {type:String, required:true},
  EmailAddress: {type:String, required:true},
  Password:{type:String, required:true},
  Address1Field:String,
  Address2Field:String,
  City:String,
  State:String,
  zipCode:String,
  Country:String,
  salt:{type:String, required:true}
});

var userModel = mongoose.model('users', userSchema);

function getUsers(userID){
  return new Promise(resolve =>{
        resolve(userModel.find({userID:userID}).then(function(users){
          return users;
        })
      );
    });
}

function getUser(userID){
  return new Promise(resolve =>{
        resolve(userModel.find({userID:userID}).then(function(user){
          return user;
        })
      );
    });
}

function getUserProfile(userName,Password){
  return new Promise(resolve =>{
        resolve(userModel.findOne({EmailAddress:userName}).then(function(user){
          return user;
        })
      );
    });
  }

  function addUser(user,Password,salt){
    var newUser = {"userID":user.userID,"FirstName":user.FirstName,"LastName":user.LastName,"EmailAddress":user.EmailAddress,"Password":Password,"Address1Field":user.Address1Field,
                   "Address2Field":user.Address2Field,"City":user.City,"State":user.State,"zipCode":user.zipCode,"Country":user.Country,
                "salt":salt};
    return new Promise(resolve =>{
          resolve(userModel.collection.insertOne(newUser).then(function(data){
            return newUser;
          })
        );
      });
  }
module.exports= {
  getUsers:getUsers,
  getUserProfile:getUserProfile,
  addUser:addUser
};

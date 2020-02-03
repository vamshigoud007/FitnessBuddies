var mongoose = require('mongoose');
var connectionDB = require('../util/connectionDB');
mongoose.connect('mongodb://localhost:27017/milestone5', {useNewUrlParser: true});
var db = mongoose.connection;
var Schema = mongoose.Schema;

var userConnectionSchema = new Schema({
  userID: {type:String, required:true},
  connectionID: {type:String, required:true},
  RSVP:{type:String, required:true},
});

var userConnectionModel = mongoose.model('userconnections', userConnectionSchema);
var connectionModel = mongoose.model('connections',connectionDB.connectionsSchema)

function getUserProfile(userID){

  return new Promise(resolve =>{
        resolve(userConnectionModel.find({userID: userID}).then(function(userConnections){
          return userConnections;
        })
      );
    });
}

function addRSVP(connectionID, userID, RSVP,connection){
  var userConnection = {"userID":userID,"connectionID":connectionID,"RSVP":RSVP};
  return new Promise(resolve =>{
        resolve(userConnectionModel.collection.insertOne(userConnection).then(function(data){
          return data;
        })
      );
    });
}

function updateRSVP(connectionID, userID, RSVP){
  var userConnection = {"userID":userID,"connectionID":connectionID,"RSVP":RSVP};
  return new Promise(resolve =>{
        resolve(userConnectionModel.updateOne({connectionID:connectionID, userID:userID},userConnection).then(function(data){
          return data;
        })
      );
    });
}

function deleteConnection(connectionID, userID){
  return new Promise(resolve =>{
        resolve(userConnectionModel.deleteOne({connectionID:connectionID, userID:userID}).then(function(data){
          return data;
        })
      );
    });
}


function addingConnection(connection,user){
  var id = '998';
  id += Math.floor(Math.random() * 10) + 7;

  date = new Date(connection.Date);
   var defaultImage = "../assets/images/def.jpg"
  var newConnection = {"userID":user.userID,"connectionID":id,"connectionName":connection.name,"connectionTopic":connection.topic,"Details":connection.Details,"location":connection.location,"Date":connection.Date,"time":connection.time,"imageUrl":defaultImage};
  return new Promise(resolve =>{
        resolve(connectionModel.collection.insertOne(newConnection).then(function(data){
          return data;
        })
      );
    });
}




module.exports= {
  getUserProfile:getUserProfile,
  addRSVP:addRSVP,
  updateRSVP:updateRSVP,
  deleteConnection:deleteConnection,
  addingConnection:addingConnection,
};

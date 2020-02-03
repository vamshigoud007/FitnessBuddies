var connection = require('./../model/connection');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/milestone5', {useNewUrlParser: true});
var db = mongoose.connection;
var Schema = mongoose.Schema;


var connectionsSchema =  new Schema({
  connectionID: {type:String, required:true},
  userID:{type:String, required:true},
  connectionName: {type:String, required:true},
  connectionTopic: {type:String, required:true},
  Details: {type:String, required:true},
  location: {type:String, required:true},
  Date: {type:String, required:true},
  time: String,
  imageUrl:String
});



var connectionModel = mongoose.model('connections', connectionsSchema);




//Getting  all the connections created
function getConnections(){
  return new Promise(resolve =>{
        resolve(connectionModel.find({}).then(function(connections){
          return connections;
        })
      );
    });
};

//getting connection based on the id specified
function getConnection(connectionID){
  return new Promise(resolve =>{
      resolve(connectionModel.find({"connectionID":connectionID}).then(function(connection){
        return connection;
      })
    );
  });
}


function getuniqueCategories()                                 //making connections dynamic
{
  return new Promise(resolve =>{
          resolve(connectionModel.distinct("connectionTopic").then(function(categories){
            return categories;
          })
        );
      });
  }


  function updateCon(userID,connection){
    var defaultImage = "../assets/images/def.jpg"
    var connection = {"connectionID":connection.connectionID,"userID":userID,"connectionName":connection.name,"connectionTopic":connection.topic,"Details":connection.Details,"location":connection.location,"Date":connection.Date,"time":connection.time,"imageUrl":defaultImage};
    return new Promise(resolve =>{
         resolve(connectionModel.updateOne({connectionID:connection.connectionID, userID:userID},connection).then(function(data){
         return data;
          })
        );
      });
  }

  function deleteCon(connectionID,userID){
    return new Promise(resolve =>{
          resolve(connectionModel.deleteOne({connectionID:connectionID, userID:userID}).then(function(data){
            return data;
          })
        );
      });
  }


module.exports={
  getConnection:getConnection,
  getuniqueCategories:getuniqueCategories,
  getConnections:getConnections,
  updateCon:updateCon,
  deleteCon:deleteCon
}

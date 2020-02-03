var UserConnection = require('./UserConnection');
var connection = require('./connection');
var userConnectionDB = require('../util/UserConnectionDB');
var connectionDB= require('../util/connectionDB');


class userProfile
{
  constructor (user){
   this.User = user;
   this.userconnectionlist=[];

}
                                                                            //when all the connections of the user are deleted


getConnection(connectionId){
 var connection;
 if(this.userconnectionlist[j].connection.connectionID === connectionId){
   connection = this.userconnectionlist[j].connection;                                              //gets connections of a particular user
 }
 return connection;
}

async addUserConnections(userID){
 var userconnectionlist =[];

 var userConnections = await userConnectionDB.getUserProfile(userID);

 for(var k=0 ; k< userConnections.length; k++){
   var connection= await connectionDB.getConnection(userConnections[k].connectionID);
   var RSVP = userConnections[k].RSVP;
   var userConnection = new UserConnection(connection[0],RSVP);
  userconnectionlist.push(userConnection);
}
 return userconnectionlist
}


async addingConnection(connection,RSVP){                                                //used to add a new connection to a users session
  var data = await userConnectionDB.addRSVP(connection.connectionID,this.User.userID,RSVP);
   }


async removeConnection(connection){
 await userConnectionDB.deleteConnection(connection.connectionID,this.User.userID);
}


async updateConnection(userConnection,userID){
 await userConnectionDB.updateRSVP(userConnection.Connection.connectionID,userID,userConnection.RSVP);
}

getConnections()
{
    return this.userconnectionlist;                                             //gets all the connections of the user
}

emptyProfile()
{
this.userconnectionlist = [];
}



existingconnections(connectionId)                                                                  //logic for checking and existing connection of the user
{
var existingConnection = 0;

  for(var k=0; k< this.userconnectionlist.length; k++ ){
    if(this.userconnectionlist[k].Connection.connectionID === connectionId){

      existingConnection = 1;
    }
  }
  return existingConnection ;
}

getIndex(connectionId){
  var index;
  for(var i=0; i< this.userconnectionlist.length; i++ ){
    if(this.userconnectionlist[i].Connection.connectionID == connectionId){
        index = i;
    }
  }
  return index;
}


}


module.exports = userProfile ;

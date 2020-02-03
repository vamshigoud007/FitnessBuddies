var connection  = function(con_Id, con_Name,con_topic,details,location,date,time,imageUrl)
{
var  connectionModel = {connectionID:con_Id, connectionName:con_Name,connectionTopic:con_topic,Details:details,location:location,Date:date,time:time,imageUrl:imageUrl};
return connectionModel;
};


module.exports.connection = connection;

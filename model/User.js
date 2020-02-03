class User
{
  constructor(userID,FirstName,LastName,EmailAddress,Password,Address1Field,Address2Field,City,State,zipCode,Country)
  {
    this.userID=userID;
    this.FirstName=FirstName;
    this.LastName=LastName;
    this.EmailAddress=EmailAddress;
    this.Password=Password;
    this.Address1Field=Address1Field;
    this.Address2Field=Address2Field;
    this.City=City;
    this.State=State;
    this.zipCode=zipCode;
    this.Country=Country
  }
}

module.exports=User;

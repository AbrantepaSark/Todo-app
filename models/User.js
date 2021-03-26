const validator = require("validator");
const bcrypt = require('bcryptjs')
const md5 = require('md5')
const usersCollection = require('../db').db().collection('users')

let User = function (data) {
  this.data = data;
  this.errors = [];
};

User.prototype.cleanUp = function(){
    if(typeof(this.data.username) != "string"){this.data.username = ''}
    if(typeof(this.data.email) != 'string'){this.data.email = ''}
    if(typeof(this.data.password) != 'string'){this.data.password = ''}

    //CLEARING NONE ESSENCIAL data
    this.data = {
        username : this.data.username.trim().toLowerCase(),
        email: this.data.email.trim().toLowerCase(),
        password: this.data.password
    }
}

User.prototype.login = function(){
    return new Promise((resolve,reject) => {
        this.cleanUp()
        usersCollection.findOne(
          {username: this.data.username}).then((attemptedUser) => {
               if (
                 attemptedUser && bcrypt.compareSync(this.data.password, attemptedUser.password)
               ) {
                 this.data = attemptedUser
                 resolve("congratulation");
               } else {
                 reject("Wrong username or password");
               }
          }).catch(function(){
              reject('Please try again later')
          })
    })
}

User.prototype.validate = function(){
  return new Promise(async (resolve,reject) => {
  if (this.data.username == "") {
    this.errors.push("You must provide a username.");
  }
  if (
    this.data.username != "" && !validator.isAlphanumeric(this.data.username)
  ) {
    this.errors.push("Username can only contain letters and numbers.");
  }
  if (!validator.isEmail(this.data.email)) {
    this.errors.push("You must provide a valid email address.");
  }
  if (this.data.password == "") {
    this.errors.push("You must provide a password.");
  }
  if (this.data.password.length > 0 && this.data.password.length < 8) {
    this.errors.push("Password must be at least 8 characters.");
  }
  if (this.data.password.length > 20) {
    this.errors.push("Password cannot exceed 20 characters.");
  }
  if (this.data.username.length > 0 && this.data.username.length < 5) {
    this.errors.push("Username must be at least 5 characters.");
  }
  if (this.data.username.length > 20) {
    this.errors.push("Username cannot exceed 20 characters.");
  }

  //CHECK IF USERNAME NOT TAKEN
  if(this.data.username.length > 4 && this.data.username.length < 21 && validator.isAlphanumeric(this.data.username)){
    let usernameExists = await usersCollection.findOne({username: this.data.username})
    if(usernameExists){
      this.errors.push('That username already taken')
    }
  }
  
  //CHECK IF EMAIL ALREADY IN USE
  if (validator.isEmail(this.data.email)) {
    let emailnameExists = await usersCollection.findOne({
      email: this.data.email,
    });
    if (emailnameExists) {
      this.errors.push("That email is already taken.");
    }
  }
  resolve()
})
}

User.prototype.register = function(){
  return new Promise(async (resolve,reject) => {
    // Step #1: Validate user data
    this.cleanUp();
    await this.validate();

    // Step #2: Only if there are no validation errors
    if (!this.errors.length) {
      //HASH USER PASSWORD
      let salt = bcrypt.genSaltSync(10);
      this.data.password = bcrypt.hashSync(this.data.password, salt);
      await usersCollection.insertOne(this.data);
      resolve()
    }
    else {
      reject(this.errors)
    }
  });
}


User.findByUsername = function(username){
  return new Promise(function(resolve,reject){
    if(typeof(username) != 'string'){
      reject()
      return
    }
    usersCollection.findOne({username: username}).then(function(userDoc){
      if(userDoc){
        userDoc = new User(userDoc,true)
        userDoc = {
          _id: userDoc.data._id,
          username: userDoc.data.username,
          avatar: userDoc.avatar
        }
        resolve(userDoc)
      }else {
        reject()
      }
    }).catch(function(){
      reject()
    })
  })
}


module.exports = User;

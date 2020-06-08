const passportLocalMongoose = require('passport-local-mongoose');
var mongoose = require('mongoose');
//const bcrypt = require('bcrypt');//hashing our password

var UserSchema = new mongoose.Schema({

  username: {
    String
  },
  password:{
    String
  } 

  // name: {
  //   type: String,
  //   unique: true,
  //   required: true,
  //   trim: true
  // },
  //  email: {
  //   type: String,
  //   unique: true,
  //   required: true,
  //   trim: true
  // },
  // password: {
  //   type: String,
  //   required: true,
  //}
});

//const UserDetails = mongoose.model('userInfo', UserDetail, 'userInfo');
UserSchema.plugin(passportLocalMongoose);
var Userdetails = mongoose.model('Userdetails', UserSchema);
module.exports = Userdetails;

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

  username:{
    type:String,
    required:true
  },

  email:{
    type:String,
    default:""
  }

});

module.exports = mongoose.model("User", UserSchema);
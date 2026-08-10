const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({

  course_id:{
    type:Number,
    required:true,
    unique:true
  },

  title:{
    type:String,
    required:true
  },

  description:{
    type:String,
    required:true
  }

});

module.exports = mongoose.model("Course", CourseSchema);
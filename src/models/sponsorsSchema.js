const { required } = require("joi");
const mongoose = require("mongoose");

const sponsorsSchema = new mongoose.Schema({
  pictures: {type:String,required:true}, 
  event_id:{
    type:mongoose.Schema.ObjectId,
    ref:"Event",
    required:true
  }
});

const Sponsor = mongoose.model("Sponsers", sponsorsSchema);
module.exports = Sponsor;

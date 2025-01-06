const mongoose = require("mongoose");

const exhibitorSchema = new mongoose.Schema({
  image: { type: String, required: true },  // Image URL or base64 string
   event_id:{
      type:mongoose.Schema.ObjectId,
      ref:"Event",
      required:true
    }
});

const Exhibitor = mongoose.model("Exhibitor", exhibitorSchema);
module.exports = Exhibitor;

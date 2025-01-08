const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  document: { type: String, required: true },  // Document URL or base64 string
   event_id:{
      type:mongoose.Schema.ObjectId,
      ref:"Event",
      required:true
    }
});

const Document = mongoose.model("Document", documentSchema);
module.exports = Document;

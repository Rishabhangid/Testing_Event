const mongoose=require("mongoose")
const bannersSchema = new mongoose.Schema({
    event_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    banner_path: {
      type: String, // Path to the banner image
      required: true,
    },
  }, { timestamps: true });
  
  const Banners = mongoose.model("Banner", bannersSchema);
  
  const thumbnailSchema = new mongoose.Schema({
    event_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    thumbnail_path: {
      type: String, // Path to the thumbnail image
      required: true,
    },
  }, { timestamps: true });
  
  const Thumbnail = mongoose.model("Thumbnail", thumbnailSchema);
  

const gallerySchema = new mongoose.Schema({
  event_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  gallery_path: {
    type: String, // Path to the gallery image
    required: true,
  },
}, { timestamps: true });

const Gallery = mongoose.model("Gallery", gallerySchema);


  
  module.exports =  {Banners,Thumbnail,Gallery} ;
  
const mongoose = require("mongoose");

const videoLinkSchema = new mongoose.Schema({
  event_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true
  },
  video_link: {
    type: String,
    required: true
  }
}, { timestamps: true });

const VideoLink = mongoose.model("VideoLink", videoLinkSchema);

module.exports.VideoLink =  VideoLink ;

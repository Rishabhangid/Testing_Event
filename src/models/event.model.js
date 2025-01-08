const { required } = require("joi");
const mongoose = require("mongoose");

// Event Schema

const eventSchema = new mongoose.Schema({
  event_title: { type: String, default: null },
  event_type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EventType",
    default: null,
  },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  start_date: { type: String, default: null },
  end_date: { type: String, default: null },
  end_time: { type: String, default: null },
  start_time: { type: String, default: null },
  description: { type: String, default: null },
  program_details: { type: String, default: null },
  exhibitor_and_participants: { type: String, default: null },
  address: { type: String, default: null },
  zip_code: { type: Number, default: null },
  country: { type: Number, default: null },
  state: { type: Number, default: null },
  city: { type: Number, default: null },
  schedule: [
    {
      date: { type: String, required: true },
      start_time: { type: String, required: true },
      end_time: { type: String, required: true },
      description: { type: String, default: null },
      title: { type: String, default: null },
    },
  ],

  package_type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PackageType",
    default: null,
  },
  package_amount: { type: Number, default: null },
  package_start_date: { type: Date, default: null },
  package_description: { type: String, default: null },
  currency: {
    type:String,
    default: null,
  },

  website_link: { type: String, default: null, required:false },
  facebook: { type: String, default: null },
  linkedin: { type: String, default: null },
  instagram: { type: String, default: null },
  twitter: { type: String, default: null },
  youtube: { type: String, default: null },
  why_to_support_event: { type: String, default: null },
  brand_versatile: { type: String, default: null },
  contact_number: { type: String, default: null },
  email: { type: String, default: null },
  is_active: { type: Boolean, default: false },
  latitude: { type: Number, default: null },
  longitude: { type: Number, default: null },

  event_status: { type: String, default: "Draft" },
  published: { type: Boolean, default: false },
  banner: { type: String, default: null },
  unpublished: { type: Boolean, default: true },
  thumbnail_path: { type: String, default: null },
  published_date: { type: Date, default: null },
  published_end_date: { type: Date, default: null },
  published_start_time: { type: String, default: null },
  published_end_time: { type: String, default: null },
  status: { type: Boolean, default: false },
  event_mode: { type: String, default: null },
  event_time_category: { type: String, default: null },
  views: { type: Number, default: 0 },
  no_of_participants: { type: Number, default: null },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  address_type: { type: String, default: null },
  landmark: { type: String, default: null },
  archive: { type: Boolean, default: false },
});

eventSchema.pre("save", function(next) {
  // Ensure that zip_code, country, state, and city are stored as numbers
  if (this.zip_code) {
    this.zip_code = Number(this.zip_code);
  }
  if (this.country) {
    this.country = Number(this.country);
  }
  if (this.state) {
    this.state = Number(this.state);
  }
  if (this.city) {
    this.city = Number(this.city);
  }
  next();
});
const Event = mongoose.model("Event", eventSchema);

module.exports.Event = Event;

const mongoose = require('mongoose');

const eventPackageCouponsSchema = new mongoose.Schema({
  event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', default: null },
  event_package_id: { type: mongoose.Schema.Types.ObjectId, ref: 'EventPackage', default: null },
  need_coupons: { type: Boolean, default: false },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  coupon_category: { type: String, default: null },
  coupon_code: { type: String, required: true },
  end_date: { type: Date, required: true },
  discount: { type: String, required: true },
  status: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  discount_type: { type: String, default: null },
  coupon_details: { type: String, default: null },
  min_amount: { type: mongoose.Decimal128, required: true },
  redeem_limit_user: { type: Number, default: null },
  redeem_limit_coupon: { type: Number, default: null },
  start_date: { type: Date, required: true },
  is_admin: { type: Boolean, default: false },
  coupon_name: { type: String, default: null }
});

// Pre-save middleware to update the 'updated_at' field on every update
eventPackageCouponsSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

const EventPackageCoupons = mongoose.model('EventPackageCoupons', eventPackageCouponsSchema);

module.exports = EventPackageCoupons;

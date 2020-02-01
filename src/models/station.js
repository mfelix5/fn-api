const mongoose = require("mongoose");

const StationSchema = new mongoose.Schema({
  current: { type: Boolean, required: true },
  destinations: { type: Object, required: true },
  effectiveDate: { type: Date, required: true },
  line: { type: String, required: true },
  name: { type: String, required: true },
  system: { type: String, required: true },
}, {
  timestamps: true,
});

const Station = mongoose.model("Station", StationSchema);
module.exports = Station;

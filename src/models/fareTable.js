const mongoose = require("mongoose");

const FareTableSchema = new mongoose.Schema({
  current: { type: Boolean, required: true },
  effectiveDate: { type: Date, required: true },
  line: { type: String, required: true },
  station: { type: String, required: true },
  system: { type: String, required: true },
  fares: { type: Object, required: true },
}, {
  timestamps: true,
});

const FareTable = mongoose.model("FareTable", FareTableSchema);
module.exports = FareTable;

const mongoose = require("mongoose");

const QuerySchema = new mongoose.Schema({
  destination: { type: String, required: true },
  fareType: { type: String, enum: ["senior", "student", "regular", "disability"], default: "regular", required: true },
  fares: { type: Object, required: true },
  month: { type: Date, required: true },
  oneWaysNeeded: {
    type: Object,
    required: true,
    week1: { type: Number, default: 0, required: true },
    week2: { type: Number, default: 0, required: true },
    week3: { type: Number, default: 0, required: true },
    week4: { type: Number, default: 0, required: true },
    week5: { type: Number, default: 0, required: false },
    week6: { type: Number, default: 0, required: false },
  },
  onHand: {
    required: false,
    type: Object,
    oneWay: { type: Number, default: 0 },
    weekly: { type: Number, default: 0 },
  },
  origin: { type: String, required: true },
  originId: { type: mongoose.Schema.Types.ObjectId, required: true },
  recommendation: {
    type: Object,
    message: { type: String },
    purchase: { type: Object },
    use: { type: Object },
    savings: { type: String },
    queryId: { type: String, required: true },
  },
  userId: { type: String, required: true },
}, {
  timestamps: true,
});

const Query = mongoose.model("Query", QuerySchema);
module.exports = Query;

const mongoose = require("mongoose");
require('dotenv').config();

const URI = process.env.NODE_ENV === "production" ? process.env.MONGODB_URI : process.env.MONGO_URI_TEST;

mongoose.connect(URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

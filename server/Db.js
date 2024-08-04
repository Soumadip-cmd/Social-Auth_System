const mongoose = require("mongoose");

const mongoUrl ="mongodb://localhost:27017/auth"

const connectToMongo = async () => {
  mongoose.connect(mongoUrl);
  console.log("database Connected..");
};

module.exports = connectToMongo;

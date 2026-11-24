require('dotenv').config()
const mongoose = require('mongoose')

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/event";

const connectToMongo = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(mongoURI);
    console.log("Connected to Mongo Successfully!");
  } catch (error) {
    console.log(error);
  }
};
module.exports = connectToMongo;
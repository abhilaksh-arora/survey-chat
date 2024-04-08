const mongoose = require("mongoose");
require("dotenv").config();

const uri = "mongodb://localhost:27017/survey-chat";

const options = {
  autoIndex: false, // Don't build indexes
  maxPoolSize: 10, // Maintain up to 10 socket connections
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
};

const connectDB = async () => {
  try {
    await mongoose.connect(uri, options);
    console.log("Database connected successfully");
  } catch (error) {
    console.error(`Database connection error: ${error}`);
  }
};

module.exports = connectDB;

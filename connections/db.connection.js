const mongoose = require("mongoose");

async function connectToMongoDB() {
  try {
    await mongoose.connect(
      "mongodb+srv://chaitanyathorat:chaitanya@atlascluster.exi2jkt.mongodb.net/expenses",
      
    );
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    throw error; 
  }
}

module.exports = connectToMongoDB;

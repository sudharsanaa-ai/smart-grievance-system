const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error('========================================================================');
    console.error('CRITICAL DATABASE ERROR: MONGO_URI environment variable is not defined!');
    console.error('Please configure MONGO_URI in your environment variables (e.g. on Render).');
    console.error('========================================================================');
    process.exit(1);
  }
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Exit process with failure in case of connection error
    process.exit(1);
  }
};

module.exports = connectDB;

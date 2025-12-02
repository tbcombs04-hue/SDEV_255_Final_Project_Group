const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Debug: Log the connection string (hide password)
    const uri = process.env.MONGODB_URI;
    console.log('Attempting to connect to MongoDB...');
    console.log('URI exists:', !!uri);
    if (uri) {
      console.log('URI starts with:', uri.substring(0, 20));
    } else {
      console.error('ERROR: MONGODB_URI is not defined in .env file!');
      console.error('Make sure you have a .env file in the backend directory');
      process.exit(1);
    }

    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;


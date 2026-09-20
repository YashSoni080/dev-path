import mongoose from "mongoose";

let cachedPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  if (!cachedPromise) {
    const opts = {
      bufferCommands: false,
    };
    cachedPromise = mongoose.connect(process.env.MONGO_URI, opts).then((conn) => {
      console.log(`MongoDB connected: ${conn.connection.host}`);
      return conn;
    });
  }

  try {
    return await cachedPromise;
  } catch (error) {
    cachedPromise = null;
    console.error(`MongoDB connection error: ${error.message}`);
    throw error;
  }
};

export default connectDB;

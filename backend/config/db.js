import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ai-scholar",
      {
        serverSelectionTimeoutMS: 3000,
        socketTimeoutMS: 3000,
        connectTimeoutMS: 3000,
      }
    );

    isConnected = true;

    console.log(
      `MongoDB Connected: ${connection.connection.host}`
    );

    return connection;
  } catch (error) {
    isConnected = false;

    console.error(
      "MongoDB connection failed:",
      error.message
    );
    console.warn(
      "Continuing without MongoDB connection. The app will run in degraded mode until MongoDB is reachable."
    );

    return null;
  }
};

export const isDbConnected = () => isConnected;

export default connectDB;
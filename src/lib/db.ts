'use server';

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;
if (!MONGODB_URI) throw new Error('Please define MONGODB_URI in .env');

export const connectToDatabase = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return mongoose.connection;
    }

    await mongoose.connect(MONGODB_URI, {
      bufferCommands: true,
    });
    console.log('MongoDB Connected');
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    throw error;
  }
};
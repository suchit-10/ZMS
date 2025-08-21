import mongoose from 'mongoose';
import { config } from '../config';

export const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(config.MONGODB_URI, {dbName:"zms-backend"});
    
    if (config.NODE_ENV === 'development') {
      console.log('✅ Connected to MongoDB successfully');
    }
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

export const closeDatabaseConnection = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error);
  }
};

mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 MongoDB disconnected');
});
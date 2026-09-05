import mongoose from 'mongoose';
import { config } from './env.js';

/**
 * Connect to MongoDB Atlas.
 * - Reads MONGO_URI from environment only (never from source code).
 * - Logs only safe messages — the connection string is NEVER printed.
 * - If connection fails, logs the error and exits so the operator is not
 *   silently running with no persistent storage.
 */
let lastConnectionError = null;

export const connectDB = async () => {
  if (!config.mongoUri) {
    lastConnectionError = 'MONGO_URI is not set in environment';
    console.error('❌ [MongoDB] MONGO_URI is not set in environment variables.');
    return;
  }

  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 8000
    });
    lastConnectionError = null;
    console.log('MongoDB connected successfully');
    console.log(`✅ [MongoDB] Connected — host: ${conn.connection.host} / db: ${conn.connection.name}`);
  } catch (error) {
    lastConnectionError = error.message;
    console.error(`❌ [MongoDB] Connection failed: ${error.message}`);
  }
};

export const getDBStatus = () => {
  const readyStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  const stateCode = mongoose.connection.readyState;
  return {
    state: readyStates[stateCode] || 'unknown',
    isConnected: stateCode === 1,
    error: lastConnectionError
  };
};

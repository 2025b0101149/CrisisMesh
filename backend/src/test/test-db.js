import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

console.log('Testing Mongo URI:', process.env.MONGO_URI ? 'Exists' : 'Missing');

try {
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 3000 });
  console.log('MongoDB successfully connected!');
  await mongoose.disconnect();
  process.exit(0);
} catch (err) {
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
}

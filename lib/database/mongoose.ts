import mongoose, { Mongoose } from 'mongoose';

// MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

console.log('MONGODB_URI', MONGODB_URI);

// Define the cached object type
interface Cached {
  conn: Mongoose | null;  // Mongoose connection object or null
  promise: Promise<Mongoose> | null; // Promise resolving to a Mongoose connection or null
}

// Create a global cached object if it doesn't exist
const globalWithMongoose = global as typeof global & { mongoose: Cached };

// Initialize or retrieve the cached object
const cached: Cached = globalWithMongoose.mongoose || { conn: null, promise: null };

// Function to connect to the database
export const connectToDatabase = async () => {
  // If there is already a connection, return it
  if (cached.conn) return cached.conn;

  // Check if the MONGODB_URI is provided
  if (!MONGODB_URI) throw new Error('MONGODB_URI is missing');

  // Create a new connection promise if there is no cached promise
  cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
    dbName: ' Imaginefy', // Database name
    bufferCommands: false,
  });

  // Await the promise and store the connection
  cached.conn = await cached.promise;

  // Cache the result globally for subsequent calls
  globalWithMongoose.mongoose = cached;

  return cached.conn;
};

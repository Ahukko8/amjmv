// lib/db.ts

import mongoose from 'mongoose';


interface DatabaseConnection {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

// We use 'var' here because it's required for global declarations
// TypeScript needs 'var' specifically for global augmentations
declare global {
  // eslint-disable-next-line no-var
  var mongooseConnection: DatabaseConnection | undefined;
}

// Explicit type checking for MONGODB_URI
const MONGODB_URI = process.env.MONGODB_URI as string;
if (!MONGODB_URI) {
  throw new Error(
    'MongoDB URI is not defined. Please ensure you have set the MONGODB_URI environment variable in your .env file'
  );
}

const cached: DatabaseConnection = global.mongooseConnection || {
  conn: null,
  promise: null,
};

if (!global.mongooseConnection) {
  global.mongooseConnection = cached;
}

async function connectDB(): Promise<mongoose.Connection> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // MongoDB connection options are passed directly to connect
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
      })
      .then((mongoose) => mongoose.connection);
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
}

export default connectDB;
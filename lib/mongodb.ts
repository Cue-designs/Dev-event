import mongoose, { Mongoose, ConnectOptions } from "mongoose";

declare global {
  // Store a cached connection across module reloads in development.
  // This avoids creating multiple connections when Next.js hot-reloads.
  // We attach it to the global object so TypeScript knows about it.
  // The name `_mongoose` is intentionally unlikely to collide.
  // eslint-disable-next-line no-var
  var _mongoose:
    | { conn: Mongoose | null; promise: Promise<Mongoose> | null }
    | undefined;
}

/**
 * MongoDB connection string from environment.
 * Throw early if missing so callers get a clear error.
 */
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}
const MONGODB_URI_STRING: string = MONGODB_URI;

/**
 * Connect to MongoDB using mongoose and cache the connection.
 * Returns a `Mongoose` instance promise that resolves when connected.
 *
 * Usage:
 *   import connectToDatabase from './lib/mongodb';
 *   const mongoose = await connectToDatabase();
 *
 * The cache is necessary for Next.js dev mode to prevent having
 * multiple open connections across module reloads.
 */
export default async function connectToDatabase(): Promise<Mongoose> {
  // Return existing cached connection if present
  if (global._mongoose?.conn) {
    return global._mongoose.conn;
  }

  // Create the global cache object if it doesn't exist yet
  if (!global._mongoose) {
    global._mongoose = { conn: null, promise: null };
  }

  // If there is no connection promise yet, create one.
  // This ensures only one `mongoose.connect` call is in-flight.
  if (!global._mongoose.promise) {
    const options: ConnectOptions = {
      // Mongoose 6+ uses sensible defaults. Add overrides here if needed.
      // Example: bufferCommands: false, serverSelectionTimeoutMS: 5000
    };

    global._mongoose.promise = mongoose
      .connect(MONGODB_URI_STRING, options)
      .then((m) => m);
  }

  // Await the connection promise and cache the resolved connection.
  global._mongoose.conn = await global._mongoose.promise;
  return global._mongoose.conn;
}

import mongoose from "mongoose";
import dns from "dns";

// DNS Patch: Force reliable DNS to resolve Atlas SRV records correctly
// This is often required in environments with restrictive DNS (e.g. MMU network)
try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
  console.log("🌐 MongoDB DNS Patch applied: Using Google & Cloudflare DNS");
} catch (e) {
  console.warn("⚠️ DNS Patch could not be fully applied:", e);
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local or your production environment.");
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000, 
      socketTimeoutMS: 45000,
      family: 4,
    };

    console.log("⏳ Connecting to MongoDB...");
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log("✅ MongoDB Connected Successfully");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    console.error("❌ MongoDB Connection Error:", e);
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;

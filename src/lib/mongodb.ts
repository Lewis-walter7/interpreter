import mongoose from "mongoose";
import dns from "dns";

// DNS Patch: Force Google DNS to resolve Atlas SRV records correctly
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
  console.log("🌐 MongoDB DNS Patch applied: Using Google DNS (8.8.8.8)");
} catch (e) {
  console.warn("⚠️ DNS Patch could not be applied:", e);
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

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
      bufferCommands: false,
      connectTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000,  // 45 seconds
      family: 4,              // Force IPv4
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log("✅ MongoDB Connected Successfully");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;

import connectDB from "./src/lib/mongodb";
import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

async function testConnection() {
  console.log("Testing MongoDB connection...");
  console.log("URI:", process.env.MONGODB_URI?.replace(/:([^@]+)@/, ":****@")); // Mask password
  
  try {
    await connectDB();
    console.log("✅ Successfully connected to MongoDB!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Connection failed!");
    console.error(error);
    process.exit(1);
  }
}

testConnection();

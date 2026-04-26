import connectDB from "./src/lib/mongodb";
import User from "./src/models/User";
import bcrypt from "bcryptjs";

async function testRegister() {
  console.log("🚀 Starting manual registration test...");
  try {
    console.log("⏳ Connecting to DB...");
    await connectDB();
    console.log("✅ DB Connected.");

    const email = `test_${Date.now()}@example.com`;
    console.log(`🔎 Checking if user exists: ${email}`);
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      console.log("❌ User already exists.");
      process.exit(1);
    }

    console.log("🔑 Hashing password...");
    const hashedPassword = await bcrypt.hash("password123", 12);
    console.log("✅ Password hashed.");

    console.log("👤 Creating user...");
    const user = await User.create({
      name: "Test User",
      email,
      password: hashedPassword,
      role: "client",
    });

    console.log("✅ User created successfully:", user._id);
    process.exit(0);
  } catch (error: any) {
    console.error("❌ Registration test failed!");
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);
    if (error.stack) console.error(error.stack);
    process.exit(1);
  }
}

testRegister();

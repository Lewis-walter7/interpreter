import connectDB from "./src/lib/mongodb";
import User from "./src/models/User";
import bcrypt from "bcryptjs";

async function createAdmin() {
  const email = "lewisindusa21@gmail.com";
  const password = "Hunterlewis@1000";
  const name = "Admin User";

  console.log("🚀 Starting Admin Creation...");
  try {
    await connectDB();
    console.log("✅ DB Connected.");

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("⚠️ User already exists. Updating to Admin role...");
      existingUser.role = "admin";
      // Update password too just in case
      const hashedPassword = await bcrypt.hash(password, 12);
      existingUser.password = hashedPassword;
      await existingUser.save();
      console.log("✅ User updated to Admin successfully.");
    } else {
      console.log("👤 Creating new Admin user...");
      const hashedPassword = await bcrypt.hash(password, 12);
      await User.create({
        name,
        email,
        password: hashedPassword,
        role: "admin",
      });
      console.log("✅ Admin user created successfully.");
    }
    process.exit(0);
  } catch (error: any) {
    console.error("❌ Admin creation failed!");
    console.error(error.message);
    process.exit(1);
  }
}

createAdmin();

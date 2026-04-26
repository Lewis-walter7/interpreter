import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    console.log("📝 Registering user:", email);
    const start = Date.now();
    await connectDB();
    console.log(`⏱ DB Connected in ${Date.now() - start}ms`);

    const checkStart = Date.now();
    const userExists = await User.findOne({ email });
    console.log(`⏱ User lookup in ${Date.now() - checkStart}ms`);

    if (userExists) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 400 });
    }

    const hashStart = Date.now();
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log(`⏱ Password hashed in ${Date.now() - hashStart}ms`);

    const createStart = Date.now();
    const userData: any = {
      name,
      email,
      password: hashedPassword,
      role,
    };

    // Initialize interpreterData with defaults if role is interpreter
    if (role === "interpreter") {
      userData.interpreterData = {
        languages: [],
        status: "unverified",
        isOnline: false,
        rating: 5,
        hourlyRate: 40,
        balance: 0
      };
    }

    const user = await User.create(userData);
    console.log(`⏱ User created in ${Date.now() - createStart}ms`);

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error: any) {
    console.error("❌ Registration error details:", error);
    
    // Handle Mongoose Validation Errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json({ message: messages.join(", ") }, { status: 400 });
    }

    // Handle Duplicate Key Errors (e.g., email)
    if (error.code === 11000) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 400 });
    }

    return NextResponse.json({ 
      message: "Internal Server Error during registration", 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    }, { status: 500 });
  }
}

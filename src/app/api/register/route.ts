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
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashStart = Date.now();
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log(`⏱ Password hashed in ${Date.now() - hashStart}ms`);

    const createStart = Date.now();
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    console.log(`⏱ User created in ${Date.now() - createStart}ms`);

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error: any) {
    console.error("❌ Registration error:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}

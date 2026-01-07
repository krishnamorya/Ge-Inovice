import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import bcrypt from "bcryptjs"
import UserModel from "@/src/model/user"


const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { first_name, last_name, email, password, refreshToken } = await request.json();

    if (!first_name || !last_name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 9);
    const newUser = new UserModel({ first_name, last_name, email, password: hashedPassword, refreshToken });
    await newUser.save();


    return NextResponse.json({ success: true, message: "User created successfully" }, { status: 201 });

  } catch (error: any) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 502 });
  }
}


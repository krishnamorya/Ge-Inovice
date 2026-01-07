import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import dbConnect from "@/lib/dbConnect"
import User from "@/src/model/user"

export async function GET(request: NextRequest) {
  console.log("get me route called")
  try {
    await dbConnect()

    // Read authorization header
    const authHeader = request.headers.get("Authorization")
    const token = authHeader?.replace("Bearer ", "")
    

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify token
    const SECRET = process.env.JWT_SECRET
    if (!SECRET) {
      throw new Error("TOKEN_KEY is missing")
    }

    let decoded: any
    try {
      decoded = jwt.verify(token, SECRET) as { userId: string }
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Fetch user from DB
    const user = await User.findById(decoded.userId).select("-password -refreshToken")

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    
    return NextResponse.json(
      { success: true, data: user },
      { status: 200 }
    )

  } catch (error) {
    console.error("Get Current User Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

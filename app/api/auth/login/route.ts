/*
 * Login API
*/

import jwt from "jsonwebtoken"
import dbConnect from "@/lib/dbConnect"
import User from "@/src/model/user"
import bcrypt from "bcryptjs"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  await dbConnect()

  try {
    const { email, password } = await request.json()

    const res = await User.findOne({ email })

    if (!res) {
      return NextResponse.json({ error: "No res found with this email" }, { status: 404 })
    }

    const isPasswordCorrect = await bcrypt.compare(password, res.password)

    if (!isPasswordCorrect) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 })
    }
    const user = await User.findById(res._id).select("-password -refreshToken")

    const accessToken = jwt.sign(
      {  userId: user?._id },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    )

    const refreshToken = jwt.sign(
      {  userId: user?._id },
      process.env.REFRESH_SECRET!,
      { expiresIn: "7d" }
    )

    await User.findByIdAndUpdate(user?._id, {
      refreshToken: refreshToken
    })

    return NextResponse.json({
      accessToken,
      refreshToken,
      user
    })

  } catch (error) {
    console.error("Login Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

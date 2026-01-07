import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import User from "@/src/model/user"
import dbConnect from "@/lib/dbConnect"

export async function POST(request: NextRequest) {
  await dbConnect()
  const body = await request.json()
  const { refreshToken } = body

  if (!refreshToken) {
    return NextResponse.json({ error: "Refresh token missing" }, { status: 400 })
  }

  try {
    const REFRESH_SECRET = process.env.REFRESH_SECRET!
    const ACCESS_SECRET = process.env.JWT_SECRET!

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as { userId: string }
    // console.log(decoded)

    // Check if token matches stored one
    const user = await User.findOne({ _id: decoded.userId, refreshToken: refreshToken })

    if (!user) {
      return NextResponse.json({ error: "Invalid refresh token" }, { status: 403 })
    }

    // Create new access token
    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      ACCESS_SECRET,
      { expiresIn: "1d" }
    )

    return NextResponse.json({
      success: true,
      accessToken: newAccessToken,
    })

  } catch (error) {
    console.error("Refresh error:", error)
    return NextResponse.json({ error: "Invalid or expired refresh token" }, { status: 403 })
  }
}

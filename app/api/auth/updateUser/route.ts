import UserModel from "@/model/user"
import jwt from "jsonwebtoken"
import dbConnect from "@/lib/dbConnect"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(request: NextRequest) {

  await dbConnect()

  console.log("Update user called from route.")

  const authorization = request.headers.get("authorization")

  const token = authorization?.replace("Bearer ", "")

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const SECRET = process.env.JWT_SECRET
  if (!SECRET) {
    throw new Error("JWT_SECRET is missing")
  }

  let decoded: any

  try {
    decoded = jwt.verify(token, SECRET) as { userId: string }
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }

  const userId = decoded.userId
  console.log("User ID from token:", userId)

  try {
    const updatedData = await request.json()

    console.log("Data to update:", updatedData)

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updatedData},
      { new: true, runValidators: true }
    ).select("-password -refreshToken")

    console.log("Updated user from route js is ", updatedUser)

    return NextResponse.json(updatedUser)

  } catch (error) {
    console.log(error)
    return NextResponse.json({ error })
  }
}
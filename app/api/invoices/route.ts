// import jwt from "jsonwebtoken"
// import dbConnect from "@/lib/dbConnect"
// import User from "@/src/model/user"
// import { type NextRequest, NextResponse } from "next/server"

// const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL

// export async function GET(request: NextRequest) {
//   try {
//     console.log("get invoice route called.")
//     const token = request.headers.get("authorization")?.replace("Bearer ", "")
//     console.log(token)
//     const searchParams = request.nextUrl.searchParams

//     const response = await fetch(`${BACKEND_URL}/api/invoices?${searchParams.toString()}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: token ? `Bearer ${token}` : "",
//       },
//     })

//     const data = await response.json()

//     if (!response.ok) {
//       return NextResponse.json({ error: data.error || "Failed to fetch invoices" }, { status: response.status })
//     }

//     return NextResponse.json(data.data || data)
//   } catch (error) {
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const token = request.headers.get("authorization")?.replace("Bearer ", "")
//     const body = await request.json()

//     const response = await fetch(`${BACKEND_URL}/api/invoices`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: token ? `Bearer ${token}` : "",
//       },
//       body: JSON.stringify(body),
//     })

//     const data = await response.json()

//     if (!response.ok) {
//       return NextResponse.json({ error: data.error || "Failed to create invoice" }, { status: response.status })
//     }

//     return NextResponse.json(data.data || data)
//   } catch (error) {
//     return NextResponse.json({ error: "Internal server error" }, { status: 501 })
//   }
// }


import { NextRequest, NextResponse } from "next/server"
import  dbConnect  from "@/lib/dbConnect"
import InvoiceModel from "@/src/model/invoice"
import jwt from "jsonwebtoken"

export async function GET(request: NextRequest) {
  console.log("Get invoice root api called")
  try {
    await dbConnect()

    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string)

    if (typeof decoded === "string") {
      throw new Error("Invalid token")
    }

    const userId = decoded.userId
    // console.log(userId)


    // fetch data
    const invoices = await InvoiceModel.find({ company_id: userId})
    // console.log(invoices)
    return NextResponse.json({ data: invoices })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string)

    if (typeof decoded === "string") {
      throw new Error("Invalid token")
    }

    const body = await request.json()

        const invoice = new InvoiceModel({
          ...body,
          company_id: decoded.userId,
        })
        console.log("Invoice is :",invoice)

        try {
          await invoice.save()
        } catch (error) {
          console.log(error)
        }

        return NextResponse.json({ data: invoice })
      

  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 529 })
  }
}

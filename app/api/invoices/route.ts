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
  try {
    await dbConnect()

    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // verify token
    let decoded

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string)
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const userId = (decoded as any).userId
    // console.log(userId)

    const searchParams = request.nextUrl.searchParams

    const status = searchParams.get("status")
    const current_page = Number(searchParams.get("page") || 1)
    const per_page = Number(searchParams.get("per_page") || 10)
    const client_id = searchParams.get("client_id")
    const sort = searchParams.get("sort") || "createdAt"
    const order = searchParams.get("order") === "asc" ? 1 : -1

    const filter : any = { company_id : userId }

    if (status) filter.status = status
    if (client_id) filter.client_id = client_id

    const skip = (current_page - 1) * per_page
    // fetch data
    const invoices = await InvoiceModel.find(filter)
    .sort({ [sort]: order})
    .skip(skip)
    .limit(per_page)


    const total = await InvoiceModel.countDocuments(filter)


    return NextResponse.json({
      success: true,
      data : {
        data : invoices,
        meta: {
          total,
          current_page,
          per_page,
          total_pages: Math.ceil(total / per_page),
        }
      }
    })
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

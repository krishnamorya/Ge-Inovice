
import { NextRequest, NextResponse } from "next/server"
import  dbConnect  from "@/lib/dbConnect"
import InvoiceModel from "@/model/invoice"
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

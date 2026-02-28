import dbConnect from "@/lib/dbConnect"
import InvoiceModel from "@/src/model/invoice"
import  Invoice  from "@/src/model/invoice"
import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  
  try {
    await dbConnect()
    const { id } = await params
    // console.log("Id to fetch is: ", id)
    const response = await  InvoiceModel.findOne({_id: id})
    if (response) {
       console.log(response)
       return NextResponse.json(response)
    }
    return NextResponse.json(response)
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 501 })
  }
}

// export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
//   try {
//     const { id } = await params
//     const token = request.headers.get("authorization")?.replace("Bearer ", "")
//     const body = await request.json()

//     const response = await fetch(`${BACKEND_URL}/api/invoices/${id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: token ? `Bearer ${token}` : "",
//       },
//       body: JSON.stringify(body),
//     })

//     const data = await response.json()

//     if (!response.ok) {
//       return NextResponse.json({ error: data.error || "Failed to update invoice" }, { status: response.status })
//     }

//     return NextResponse.json(data.data || data)
//   } catch (error) {
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

// export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
//   try {
//     const { id } = await params
//     const token = request.headers.get("authorization")?.replace("Bearer ", "")

//     const response = await fetch(`${BACKEND_URL}/api/invoices/${id}`, {
//       method: "DELETE",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: token ? `Bearer ${token}` : "",
//       },
//     })

//     const data = await response.json()

//     if (!response.ok) {
//       return NextResponse.json({ error: data.error || "Failed to delete invoice" }, { status: response.status })
//     }

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

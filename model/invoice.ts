import mongoose, { Document, Schema, Types, ArrayExpression } from "mongoose"

// ===== INVOICES =====
export interface Invoice extends Document {
  _id: Types.ObjectId
  company_id: string
  client_id: string
  invoice_number?: String
  invoice_date: string
  due_date: string
  status?: InvoiceStatus
  line_items?: InvoiceLineItem[]
  discount: number
  amount: number
  balance?: number
  paid_amount: number
  currency_id?: string
  is_deleted: boolean
  createdAt: Date
  updatedAt: Date
}


const invoiceSchema = new Schema<Invoice>(
  {
    company_id: {
      type: String,
      required: true,
    },
    client_id: {
      type: String,
      required: true,
    },
    // invoice_number: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },
    invoice_date: {
      type: String,
      required: true,
    },
    due_date: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "sent", "paid", "pending", "overdue"],
      default: "paid",
    },
    line_items: {
      type: Array,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    amount: {
      type: Number,
      required: true,
    },
    paid_amount: {
      type: Number,
      default: 0,
    },
    // balance: {
    //   type: Number,
    //   required: true,
    // },
    // currency_id: {
    //   type: String,
    //   required: true,
    // },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)


export enum InvoiceStatus {
  DRAFT = "draft",
  PENDING = "pending",
  SENT = "sent",
  // VIEWED = "viewed",
  PARTIAL = "partial",
  PAID = "paid",
  CANCELLED = "cancelled",
  ARCHIVED = "archived",
}

export interface InvoiceLineItem {
  id?: string
  invoice_id?: string
  product_id?: string
  description: string
  quantity: number
  cost: number // unit price
  tax_name1?: string
  tax_rate1?: number
  sort_order: number
}

export interface CreateInvoicePayload {
  client_id: string
  invoice_date: string
  due_date: string
  line_items: InvoiceLineItem[]
  discount?: number
  // notes?: string
  // terms?: string
  // public_notes?: string
  status?: InvoiceStatus
  // amount: number
}


const InvoiceModel = mongoose.models.Invoice as mongoose.Model<Invoice> || mongoose.model<Invoice>("Invoice", invoiceSchema)
export default InvoiceModel
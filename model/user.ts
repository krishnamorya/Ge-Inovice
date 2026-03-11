
import mongoose, {Schema, Document} from "mongoose"

/**
 * Domain models and types for Invoice
 * All entities are strongly typed with TypeScript
 */

// ===== USER & AUTH =====
export interface User extends Document {
  id?: string
  email: string
  password: string
  first_name: string
  last_name: string
  phone: string
  profile_picture?: string
  company_id?: string
  account_id?: string
  created_at?: string
  updated_at?: string
  refreshToken?: string
}

export type UpdateUserPayload = Partial<
  Pick<User, "first_name" | "last_name" | "email" | "phone" | "profile_picture">
>

const userSchema : Schema<User> = new Schema({
  first_name: {
    type: String,
    required: true,
    trim: true
  },
  last_name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String
  }
}, {timestamps: true}
)

export interface AuthState {
  user: User | null
  accessToken?: string | null
  refreshToken?: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// ===== COMPANY & ACCOUNT =====
export interface Company {
  id: string
  name: string
  logo?: string
  website?: string
  phone?: string
  email?: string
  street_address?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
  account_id: string
  created_at: string
  updated_at: string
}

export interface Account {
  id: string
  name: string
  created_at: string
  updated_at: string
}

// ===== CLIENTS & CONTACTS =====
export interface Client {
  id: string
  company_id: string
  name: string
  email?: string
  phone?: string
  website?: string
  street_address?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
  currency_id: string
  language_id: string
  is_deleted: boolean
  archived_at?: string
  created_at: string
  updated_at: string
}

export interface ClientContact {
  id: string
  client_id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  is_primary: boolean
  created_at: string
  updated_at: string
}

// ===== INVOICES =====
export enum InvoiceStatus {
  DRAFT = "draft",
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

export interface Invoice {
  id: string
  company_id: string
  client_id: string
  invoice_number: string
  invoice_date: string
  due_date: string
  status: InvoiceStatus
  line_items: InvoiceLineItem[]
  discount: number
  tax_name1?: string
  tax_rate1?: number
  notes?: string
  terms?: string
  public_notes?: string
  amount: number
  balance: number
  paid_amount: number
  currency_id: string
  is_deleted: boolean
  archived_at?: string
  sent_at?: string
  viewed_at?: string
  paid_at?: string
  created_at: string
  updated_at: string
}

export interface CreateInvoicePayload {
  client_id: string
  invoice_date: string
  due_date: string
  line_items: InvoiceLineItem[]
  discount?: number
  notes?: string
  terms?: string
  public_notes?: string
  status?: InvoiceStatus
}

// ===== EXPENSES =====
export enum ExpenseCategory {
  ADVERTISING = "advertising",
  MEALS = "meals",
  MATERIALS = "materials",
  MILEAGE = "mileage",
  OFFICE = "office",
  RENT = "rent",
  TRAVEL = "travel",
  UTILITIES = "utilities",
  OTHER = "other",
}

export interface Expense {
  id: string
  company_id: string
  client_id?: string
  project_id?: string
  invoice_id?: string
  vendor_id?: string
  user_id: string
  category: ExpenseCategory
  amount: number
  currency_id: string
  expense_date: string
  notes?: string
  receipt?: string
  is_billable: boolean
  is_deleted: boolean
  created_at: string
  updated_at: string
}

// ===== PAYMENTS =====
export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  REFUNDED = "refunded",
  CANCELLED = "cancelled",
}

export interface Payment {
  id: string
  company_id: string
  invoice_id: string
  client_id: string
  amount: number
  currency_id: string
  date: string
  status: PaymentStatus
  gateway: string
  transaction_reference?: string
  notes?: string
  created_at: string
  updated_at: string
}

// ===== COMMON TYPES =====
export interface PaginationParams {
  page?: number
  per_page?: number
  sort?: string
  order?: "asc" | "desc"
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    per_page: number
    total: number
    total_pages: number
  }
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User", userSchema)
export default UserModel;
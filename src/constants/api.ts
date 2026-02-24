/**
 * API Configuration and constants
 */

// API Base URL - use environment variable or fallback
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  REGISTER: "/auth/register",
  REFRESH: "/auth/refresh",
  ME: "/auth/me",

  // Invoices
  INVOICES: "/invoices",
  INVOICE_DETAIL: (id: string) => `/invoices/${id}`,
  INVOICE_SEND: (id: string) => `/invoices/${id}/send`,
  INVOICE_MARK_SENT: (id: string) => `/invoices/${id}/mark-sent`,
  INVOICE_MARK_PAID: (id: string) => `/invoices/${id}/mark-paid`,
  INVOICE_ARCHIVE: (id: string) => `/invoices/${id}/archive`,
  INVOICE_DELETE: (id: string) => `/invoices/${id}`,


  // Expenses
  EXPENSES: "/expenses",
  EXPENSE_DETAIL: (id: string) => `/expenses/${id}`,

  // Clients
  CLIENTS: "/clients",
  CLIENT_DETAIL: (id: string) => `/clients/${id}`,

  // Company
  COMPANIES: "/companies",
  COMPANY_DETAIL: (id: string) => `/companies/${id}`,
  COMPANY_UPDATE: (id: string) => `/companies/${id}`,
}

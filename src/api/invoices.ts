/**
 * Invoice API Service Layer
 * All invoice-related API operations with strong typing
 */

import { apiClient } from "./client"
import type { PaginatedResponse } from "@/src/model/user"
import type { Invoice, CreateInvoicePayload } from "@/src/model/invoice"

export const invoicesApi = {
  /**
   * Get paginated list of invoices
   */
  getInvoices: async (params?: {
    page?: number
    per_page?: number
    status?: string
    client_id?: string
    sort?: string
    order?: "asc" | "desc"
  }) => {
    return apiClient.get<PaginatedResponse<Invoice>>("/invoices", params)
  },

  /**
   * Get single invoice by ID
   */
  getInvoice: async (id: string) => {
    return apiClient.get<Invoice>(`/invoices/${id}`)
  },

  /**
   * Create new invoice
   */
  createInvoice: async (payload: CreateInvoicePayload) => {
    console.log("Create invoice called from src/api")
    return apiClient.post<Invoice>("/invoices", payload)
  },

  /**
   * Update existing invoice
   */
  updateInvoice: async (id: string, payload: Partial<CreateInvoicePayload>) => {
    return apiClient.put<Invoice>(`/invoices/${id}`, payload)
  },

  /**
   * Delete invoice (soft delete)
   */
  deleteInvoice: async (id: string) => {
    return apiClient.delete<Invoice>(`/invoices/${id}`)
  },

  /**
   * Archive invoice
   */
  archiveInvoice: async (id: string) => {
    return apiClient.post<Invoice>(`/invoices/${id}/archive`)
  },

  /**
   * Send invoice to client
   */
  sendInvoice: async (id: string, email?: string) => {
    return apiClient.post<Invoice>(`/invoices/${id}/send`, { email })
  },

  /**
   * Mark invoice as paid
   */
  markInvoiceAsPaid: async (id: string, amount: number) => {
    return apiClient.post<Invoice>(`/invoices/${id}/mark-paid`, { amount })
  },

  /**
   * Mark invoice as sent
   */
  markInvoiceAsSent: async (id: string) => {
    return apiClient.post<Invoice>(`/invoices/${id}/mark-sent`)
  },
}

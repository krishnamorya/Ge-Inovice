/**
 * Custom hook for invoice data fetching and management
 * Wraps invoice API calls with caching and loading states
 */

"use client"

import { useState, useCallback } from "react"
import type { Invoice, CreateInvoicePayload } from "@/src/model/invoice"
import { invoicesApi } from "@/api/invoices"


interface UseInvoicesOptions {
  page?: number
  per_page?: number
  status?: string
  client_id?: string
}

export function useInvoices(options: UseInvoicesOptions = {}) {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 15,
    total: 0,
    last_page: 1,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchInvoices = useCallback(
    async (newOptions: UseInvoicesOptions = {}) => {
      setIsLoading(true)
      setError(null)

      const response = await invoicesApi.getInvoices({
        ...options,
        ...newOptions,
      })

      if (response.success && response.data) {
        setInvoices(response.data.data)
        setPagination(response.data.meta)
      } else {
        setError(response.error || "Failed to fetch invoices")
      }

      setIsLoading(false)
    },
    [options],
  )

  const createInvoice = useCallback(
    async (payload: CreateInvoicePayload) => {
      console.log("Create invoice called")
      setIsLoading(true)
      setError(null)

      const response = await invoicesApi.createInvoice(payload)

      if (response.success) {
        await fetchInvoices()
        return response.data
      } else {
        setError(response.error || "Failed to create invoice")
        throw new Error(response.error || "Failed to create invoice")
      }
    },
    [fetchInvoices],
  )

  const updateInvoice = useCallback(
    async (id: string, payload: Partial<CreateInvoicePayload>) => {
      setIsLoading(true)
      setError(null)

      const response = await invoicesApi.updateInvoice(id, payload)

      if (response.success) {
        await fetchInvoices()
        return response.data
      } else {
        setError(response.error || "Failed to update invoice")
        throw new Error(response.error || "Failed to update invoice")
      }
    },
    [fetchInvoices],
  )

  const deleteInvoice = useCallback(
    async (id: string) => {
      setIsLoading(true)
      setError(null)

      const response = await invoicesApi.deleteInvoice(id)

      if (response.success) {
        await fetchInvoices()
      } else {
        setError(response.error || "Failed to delete invoice")
        throw new Error(response.error || "Failed to delete invoice")
      }
    },
    [fetchInvoices],
  )

  const sendInvoice = useCallback(async (id: string, email?: string) => {
    setError(null)
    const response = await invoicesApi.sendInvoice(id, email)

    if (!response.success) {
      setError(response.error || "Failed to send invoice")
      throw new Error(response.error || "Failed to send invoice")
    }

    return response.data
  }, [])

  return {
    invoices,
    pagination,
    isLoading,
    error,
    fetchInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    sendInvoice,
  }
}

"use client"

/**
 * Custom hook for Payments data management
 */

import { useState, useCallback } from "react"

import type { Payment, PaginationParams } from "@/src/model"

interface UsePaymentsState {
  payments: Payment[]
  loading: boolean
  error: string | null
}

export function usePayments() {
  const [state, setState] = useState<UsePaymentsState>({
    payments: [],
    loading: false,
    error: null,
  })

  const fetchPayments = useCallback(async (params?: PaginationParams) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const result = await paymentsApi.getPayments(params)
      setState((prev) => ({ ...prev, payments: result.data, loading: false }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to fetch payments",
        loading: false,
      }))
    }
  }, [])

  const createPayment = useCallback(async (payload: any) => {
    try {
      const newPayment = await paymentsApi.createPayment(payload)
      setState((prev) => ({ ...prev, payments: [...prev.payments, newPayment] }))
      return newPayment
    } catch (error) {
      throw error
    }
  }, [])

  const refundPayment = useCallback(async (id: string, amount?: number) => {
    try {
      const updated = await paymentsApi.refundPayment(id, amount)
      setState((prev) => ({
        ...prev,
        payments: prev.payments.map((p) => (p.id === id ? updated : p)),
      }))
      return updated
    } catch (error) {
      throw error
    }
  }, [])

  return {
    payments: state.payments,
    loading: state.loading,
    error: state.error,
    fetchPayments,
    createPayment,
    refundPayment,
  }
}

"use client"

/**
 * Custom hook for Expenses data management
 */

import { useState, useCallback } from "react"

import type { Expense, PaginationParams } from "@/src/model"

interface UseExpensesState {
  expenses: Expense[]
  loading: boolean
  error: string | null
}

export function useExpenses() {
  const [state, setState] = useState<UseExpensesState>({
    expenses: [],
    loading: false,
    error: null,
  })

  const fetchExpenses = useCallback(async (params?: PaginationParams) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const result = await expensesApi.getExpenses(params)
      setState((prev) => ({ ...prev, expenses: result.data, loading: false }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to fetch expenses",
        loading: false,
      }))
    }
  }, [])

  const createExpense = useCallback(async (payload: any) => {
    try {
      const newExpense = await expensesApi.createExpense(payload)
      setState((prev) => ({ ...prev, expenses: [...prev.expenses, newExpense] }))
      return newExpense
    } catch (error) {
      throw error
    }
  }, [])

  const updateExpense = useCallback(async (id: string, payload: any) => {
    try {
      const updated = await expensesApi.updateExpense(id, payload)
      setState((prev) => ({
        ...prev,
        expenses: prev.expenses.map((e) => (e.id === id ? updated : e)),
      }))
      return updated
    } catch (error) {
      throw error
    }
  }, [])

  const deleteExpense = useCallback(async (id: string) => {
    try {
      await expensesApi.deleteExpense(id)
      setState((prev) => ({ ...prev, expenses: prev.expenses.filter((e) => e.id !== id) }))
    } catch (error) {
      throw error
    }
  }, [])

  const markAsBillable = useCallback(async (id: string, invoiceId: string) => {
    try {
      const updated = await expensesApi.markAsBillable(id, invoiceId)
      setState((prev) => ({
        ...prev,
        expenses: prev.expenses.map((e) => (e.id === id ? updated : e)),
      }))
      return updated
    } catch (error) {
      throw error
    }
  }, [])

  // Calculate total expenses
  const totalExpenses = useCallback(() => {
    return state.expenses.reduce((acc, expense) => acc + expense.amount, 0)
  }, [state.expenses])

  // Calculate billable expenses
  const billableExpenses = useCallback(() => {
    return state.expenses.filter((e) => e.is_billable).reduce((acc, expense) => acc + expense.amount, 0)
  }, [state.expenses])

  return {
    expenses: state.expenses,
    loading: state.loading,
    error: state.error,
    fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    markAsBillable,
    totalExpenses,
    billableExpenses,
  }
}

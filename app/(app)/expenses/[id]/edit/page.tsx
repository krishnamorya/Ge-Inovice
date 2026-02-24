/**
 * Edit expense page
 */

"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { expensesApi } from "@/api"
import { ExpenseForm } from "@/components/expenses/expense-form"
import type { Expense } from "@/src/model"

export default function EditExpensePage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const [expense, setExpense] = useState<Expense | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadExpense = async () => {
      try {
        const data = await expensesApi.getExpense(id)
        setExpense(data)
      } catch (error) {
        console.error("Failed to load expense:", error)
      } finally {
        setLoading(false)
      }
    }

    loadExpense()
  }, [id])

  if (loading) return <div>Loading...</div>
  if (!expense) return <div>Expense not found</div>

  const handleSubmit = (updated: Expense) => {
    router.push("/expenses")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Expense</h1>
      <ExpenseForm expense={expense} onSubmit={handleSubmit} />
    </div>
  )
}

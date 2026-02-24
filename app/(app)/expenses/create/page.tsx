/**
 * Create expense page
 */

"use client"

import { useRouter } from "next/navigation"
import { ExpenseForm } from "@/components/expenses/expense-form"
import type { Expense } from "@/src/model"

export default function CreateExpensePage() {
  const router = useRouter()

  const handleSubmit = (expense: Expense) => {
    router.push("/expenses")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Create Expense</h1>
      <ExpenseForm onSubmit={handleSubmit} />
    </div>
  )
}

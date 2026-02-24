/**
 * Expense table component
 */

"use client"

import { useRouter } from "next/navigation"
import { useExpenses } from "@/hooks"
import { formatCurrency, formatDate } from "@/lib/format"
import type { ExpenseCategory } from "@/src/model"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const categoryColors: Record<ExpenseCategory, string> = {
  advertising: "bg-blue-100 text-blue-800",
  meals: "bg-orange-100 text-orange-800",
  materials: "bg-purple-100 text-purple-800",
  mileage: "bg-green-100 text-green-800",
  office: "bg-yellow-100 text-yellow-800",
  rent: "bg-red-100 text-red-800",
  travel: "bg-teal-100 text-teal-800",
  utilities: "bg-indigo-100 text-indigo-800",
  other: "bg-slate-100 text-slate-800",
}

export function ExpenseTable() {
  const { expenses, loading } = useExpenses()
  const router = useRouter()

  if (loading) return <div className="p-4">Loading expenses...</div>

  return (
    <Card className="rounded-lg">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-slate-50">
            <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Description</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Billable</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id} className="border-b hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 text-sm">{formatDate(expense.expense_date)}</td>
              <td className="px-6 py-4 text-sm">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[expense.category]}`}>
                  {expense.category}
                </span>
              </td>
              <td className="px-6 py-4 text-sm">{expense.notes || "-"}</td>
              <td className="px-6 py-4 text-sm font-medium">{formatCurrency(expense.amount, expense.currency_id)}</td>
              <td className="px-6 py-4 text-sm">
                <span className={expense.is_billable ? "text-green-600 font-medium" : "text-slate-500"}>
                  {expense.is_billable ? "Yes" : "No"}
                </span>
              </td>
              <td className="px-6 py-4 text-sm space-x-2">
                <Button variant="outline" size="sm" onClick={() => router.push(`/expenses/${expense.id}/edit`)}>
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {expenses.length === 0 && <div className="p-8 text-center text-slate-500">No expenses found</div>}
    </Card>
  )
}

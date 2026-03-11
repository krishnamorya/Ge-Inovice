/**
 * Expense form component for creating and editing
 */

"use client"

import type React from "react"

import { useState } from "react"
import  expensesApi  from "@/api/expensesApi"
import type { Expense, ExpenseCategory } from "@/model/user"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface ExpenseFormProps {
  expense?: Expense
  onSubmit?: (expense: Expense) => void
}

export function ExpenseForm({ expense, onSubmit }: ExpenseFormProps) {
  const [category, setCategory] = useState<ExpenseCategory>(expense?.category || "other")
  const [amount, setAmount] = useState(expense?.amount || 0)
  const [notes, setNotes] = useState(expense?.notes || "")
  const [expenseDate, setExpenseDate] = useState(
    expense?.expense_date.split("T")[0] || new Date().toISOString().split("T")[0],
  )
  const [isBillable, setIsBillable] = useState(expense?.is_billable || false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const categories: ExpenseCategory[] = [
    "advertising",
    "meals",
    "materials",
    "mileage",
    "office",
    "rent",
    "travel",
    "utilities",
    "other",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const payload = {
        category,
        amount,
        notes,
        expense_date: expenseDate,
        is_billable: isBillable,
      }

      let result: Expense
      if (expense?.id) {
        result = await expensesApi.updateExpense(expense.id, payload)
      } else {
        result = await expensesApi.createExpense(payload as any)
      }

      onSubmit?.(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save expense")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number.parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description/Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg h-24"
            placeholder="Add notes about this expense..."
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="billable"
            checked={isBillable}
            onChange={(e) => setIsBillable(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300"
          />
          <label htmlFor="billable" className="text-sm font-medium">
            Mark as billable to client
          </label>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Expense"}
          </Button>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}

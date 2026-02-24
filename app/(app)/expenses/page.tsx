"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useExpenses } from "@/hooks"
import { ExpenseTable } from "@/components/expenses/expense-table"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function ExpensesPage() {
  const { fetchExpenses, totalExpenses, billableExpenses } = useExpenses()
  const router = useRouter()

  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Expenses</h1>
        <Button onClick={() => router.push("/expenses/create")}>Add Expense</Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-6">
          <p className="text-sm text-slate-600 mb-2">Total Expenses</p>
          <p className="text-3xl font-bold">${totalExpenses().toFixed(2)}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-slate-600 mb-2">Billable Expenses</p>
          <p className="text-3xl font-bold text-green-600">${billableExpenses().toFixed(2)}</p>
        </Card>
      </div>

      <ExpenseTable />
    </div>
  )
}

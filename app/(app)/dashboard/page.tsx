/**
 * Main dashboard page
 * Shows overview, recent invoices, and quick stats
 */

"use client"

import { useEffect, useState } from "react"
import { useInvoices } from "@/hooks"
import { Card } from "@/components/ui/card"
import { InvoiceTable } from "@/components/invoices/invoice-table"
import { FileText, DollarSign, Clock, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  const { invoices, fetchInvoices, isLoading } = useInvoices({ per_page: 5 })
  const [stats, setStats] = useState({
    total_invoiced: 0,
    total_paid: 0,
    total_pending: 0,
    total_overdue: 0,
  })

  useEffect(() => {
    fetchInvoices()
  }, [])

  // Calculate stats from invoices
  // useEffect(() => {
  //   const newStats = {
  //     total_invoiced: invoices.reduce((sum, inv) => sum + inv.amount, 0),
  //     total_paid: invoices.filter((inv) => inv.status === "paid").reduce((sum, inv) => sum + inv.amount, 0),
  //     total_pending: invoices
  //       .filter((inv) => ["draft", "sent", "viewed"].includes(inv.status))
  //       .reduce((sum, inv) => sum + inv.balance, 0),
  //     total_overdue: 0, // Would need date logic
  //   }
  //   setStats(newStats)
  // }, [invoices])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your financial overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Invoiced</p>
              <p className="text-2xl font-bold">${stats.total_invoiced.toFixed(2)}</p>
            </div>
            <DollarSign className="text-primary opacity-20" size={32} />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Paid</p>
              <p className="text-2xl font-bold text-green-600">${stats.total_paid.toFixed(2)}</p>
            </div>
            <TrendingUp className="text-green-600 opacity-20" size={32} />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">${stats.total_pending.toFixed(2)}</p>
            </div>
            <Clock className="text-yellow-600 opacity-20" size={32} />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Invoices</p>
              {/* <p className="text-2xl font-bold">{invoices.length}</p> */}
            </div>
            <FileText className="text-primary opacity-20" size={32} />
          </div>
        </Card>
      </div>

      {/* Recent Invoices */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Invoices</h2>
        {/* <InvoiceTable invoices={invoices} isLoading={isLoading} /> */}
      </Card>
    </div>
  )
}

/**
 * Client portal dashboard
 * Shows client's invoices, quotes, and payments
 */

"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { invoicesApi} from "@/api/invoices"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Invoice } from "@/src/model/user"

export default function ClientDashboardPage() {
  const router = useRouter()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const clientEmail = typeof window !== "undefined" ? localStorage.getItem("client_email") : null

  useEffect(() => {
    if (!clientEmail) {
      router.push("/client/login")
      return
    }

    const loadData = async () => {
      try {
        const [invoicesRes] = await Promise.all([invoicesApi.getInvoices()])
        // setInvoices(invoicesRes.data)
      } catch (error) {
        // console.error("Failed to load data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [clientEmail, router])

  if (loading) return <div>Loading...</div>

  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.amount, 0)
  const totalPaid = invoices.reduce((sum, inv) => sum + inv.paid_amount, 0)
  const totalOutstanding = invoices.reduce((sum, inv) => sum + inv.balance, 0)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
        <p className="text-slate-600 mt-2">Here's your invoice and quote summary</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="p-6">
          <p className="text-sm text-slate-600 font-medium">Total Invoiced</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">${totalInvoiced.toFixed(2)}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-slate-600 font-medium">Total Paid</p>
          <p className="text-3xl font-bold text-green-600 mt-2">${totalPaid.toFixed(2)}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-slate-600 font-medium">Outstanding</p>
          <p className="text-3xl font-bold text-red-600 mt-2">${totalOutstanding.toFixed(2)}</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Recent Invoices</h2>
        <div className="space-y-3">
          {invoices.slice(0, 5).map((invoice) => (
            <div
              key={invoice.id}
              className="flex justify-between items-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div>
                <p className="font-medium text-slate-900">{invoice.invoice_number}</p>
                <p className="text-sm text-slate-600">${invoice.amount.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    invoice.status === "paid"
                      ? "bg-green-100 text-green-800"
                      : invoice.status === "sent"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-slate-100 text-slate-800"
                  }`}
                >
                  {invoice.status}
                </span>
                <Button variant="outline" size="sm" onClick={() => router.push(`/client/invoices/${invoice.id}`)}>
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

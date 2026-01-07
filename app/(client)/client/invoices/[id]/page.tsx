/**
 * Client view of specific invoice
 */

"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { invoicesApi } from "@/api/invoices"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Invoice } from "@/src/model/user"

export default function ClientInvoiceDetailPage() {
  const { id } = useParams() as { id: string }
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadInvoice = async () => {
      try {
        const data = await invoicesApi.getInvoice(id)
        setInvoice(data)
      } catch (error) {
        console.error("Failed to load invoice:", error)
      } finally {
        setLoading(false)
      }
    }

    loadInvoice()
  }, [id])

  if (loading) return <div>Loading...</div>
  if (!invoice) return <div>Invoice not found</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Invoice {invoice.invoice_number}</h1>
          <p className="text-slate-600 mt-2">
            Status: <span className="font-semibold capitalize">{invoice.status}</span>
          </p>
        </div>
        {invoice.status !== "paid" && <Button size="lg">Pay Now</Button>}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-slate-600 mb-4">Invoice Details</h3>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-slate-600">Invoice Date</p>
              <p className="font-medium">{new Date(invoice.invoice_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Due Date</p>
              <p className="font-medium">{new Date(invoice.due_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Invoice Number</p>
              <p className="font-medium">{invoice.invoice_number}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-semibold text-slate-600 mb-4">Amount Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-sm text-slate-600">Total</p>
              <p className="font-medium">${invoice.amount.toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-slate-600">Paid</p>
              <p className="font-medium text-green-600">${invoice.paid_amount.toFixed(2)}</p>
            </div>
            <div className="flex justify-between border-t pt-2">
              <p className="text-sm font-semibold">Balance Due</p>
              <p className="font-bold text-red-600">${invoice.balance.toFixed(2)}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Line Items</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 text-sm font-semibold">Description</th>
              <th className="text-right py-2 text-sm font-semibold">Qty</th>
              <th className="text-right py-2 text-sm font-semibold">Price</th>
              <th className="text-right py-2 text-sm font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.line_items.map((item, idx) => (
              <tr key={idx} className="border-b">
                <td className="py-3 text-sm">{item.description}</td>
                <td className="text-right py-3 text-sm">{item.quantity}</td>
                <td className="text-right py-3 text-sm">${item.cost.toFixed(2)}</td>
                <td className="text-right py-3 text-sm font-medium">${(item.quantity * item.cost).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {invoice.notes && (
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-slate-600 mb-2">Notes</h3>
          <p className="text-slate-700">{invoice.notes}</p>
        </Card>
      )}
    </div>
  )
}

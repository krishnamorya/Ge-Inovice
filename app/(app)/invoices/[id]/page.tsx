/**
 * Invoice detail page
 */

"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { invoicesApi } from "@/api"
import type { Invoice } from "@/src/model"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { formatCurrency, formatDate } from "@/lib/format"
import { ArrowLeft, Edit2, Send, Download } from "lucide-react"

export default function InvoiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const invoiceId = params.id as string

  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInvoice = async () => {
      setIsLoading(true)
      const response = await invoicesApi.getInvoice(invoiceId)

      if (response.success && response.data) {
        setInvoice(response.data)
      } else {
        setError(response.error || "Failed to load invoice")
      }

      setIsLoading(false)
    }

    fetchInvoice()
  }, [invoiceId])

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Loading invoice...</p>
      </div>
    )
  }

  if (error || !invoice) {
    return (
      <div className="p-8">
        <div className="bg-destructive/10 border border-destructive rounded-lg p-4 text-destructive">
          {error || "Invoice not found"}
        </div>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "secondary"
      case "sent":
        return "info"
      case "paid":
        return "success"
      case "cancelled":
        return "destructive"
      default:
        return "default"
    }
  }

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{invoice.invoice_number}</h1>
            <Badge variant={getStatusColor(invoice.status)} className="mt-2">
              {invoice.status}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/invoices/${invoice.id}/edit`}>
            <Button variant="outline">
              <Edit2 size={16} className="mr-2" />
              Edit
            </Button>
          </Link>
          <Button variant="outline">
            <Send size={16} className="mr-2" />
            Send
          </Button>
          <Button variant="outline">
            <Download size={16} className="mr-2" />
            Download
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Invoice Info */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Invoice Details</h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground">Invoice Date</p>
              <p className="font-medium">{formatDate(invoice.invoice_date)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Due Date</p>
              <p className="font-medium">{formatDate(invoice.due_date)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Client</p>
              <p className="font-medium">{invoice.client_id}</p>
            </div>
          </div>
        </Card>

        {/* Amount Info */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Amount</h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground">Total Amount</p>
              <p className="text-xl font-bold">{formatCurrency(invoice.amount)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Paid</p>
              <p className="font-medium text-green-600">{formatCurrency(invoice.paid_amount)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Balance</p>
              <p className="font-medium">{formatCurrency(invoice.balance)}</p>
            </div>
          </div>
        </Card>

        {/* Status */}
        <Card className="p-6 bg-muted">
          <h3 className="font-semibold mb-4">Status</h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground">Current Status</p>
              <Badge variant={getStatusColor(invoice.status)} className="mt-2">
                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
              </Badge>
            </div>
            {invoice.sent_at && (
              <div>
                <p className="text-muted-foreground">Sent</p>
                <p className="font-medium">{formatDate(invoice.sent_at)}</p>
              </div>
            )}
            {invoice.paid_at && (
              <div>
                <p className="text-muted-foreground">Paid</p>
                <p className="font-medium">{formatDate(invoice.paid_at)}</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Line Items */}
      <Card className="p-6 mb-8">
        <h3 className="font-semibold mb-4">Line Items</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Description</th>
              <th className="text-right py-2">Qty</th>
              <th className="text-right py-2">Unit Price</th>
              <th className="text-right py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.line_items.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-3">{item.description}</td>
                <td className="text-right">{item.quantity}</td>
                <td className="text-right">{formatCurrency(item.cost)}</td>
                <td className="text-right font-medium">{formatCurrency(item.quantity * item.cost)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Notes */}
      {(invoice.notes || invoice.public_notes) && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Notes</h3>
          <div className="space-y-4">
            {invoice.notes && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Private Notes</p>
                <p className="text-sm">{invoice.notes}</p>
              </div>
            )}
            {invoice.public_notes && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Public Notes</p>
                <p className="text-sm">{invoice.public_notes}</p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}

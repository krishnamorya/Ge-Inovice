/**
 * Invoice list table component with sorting and filtering
 */

"use client"

import type { Invoice } from "@/src/model/invoice"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit2, Trash2, Send } from "lucide-react"
import Link from "next/link"
import { formatCurrency, formatDate } from "@/lib/format"
// import { useInvoices } from "@/src/hooks/use-invoices"

interface InvoiceTableProps {
  invoices: Invoice[]
  onDelete?: (id: string) => void
  onSend?: (id: string) => void
  isLoading?: boolean
}

export function InvoiceTable({ invoices, onDelete, onSend, isLoading }: InvoiceTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "secondary"
      case "sent":
        return "info"
      case "pending":
        return "warning"
      case "partial":
        return "warning"
      case "paid":
        return "success"
      case "cancelled":
        return "destructive"
      default:
        return "default"
    }
  }

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading invoices...</div>
  }

  if (invoices.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>
          No invoices found.{" "}
          <Link href="/invoices/create" className="text-primary hover:underline">
            Create one
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead>Invoice #</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice._id}>
              <TableCell className="font-medium">{invoice._id}</TableCell>
              <TableCell>{invoice.client_id}</TableCell>
              <TableCell>{formatCurrency(invoice.amount)}</TableCell>
              <TableCell>
                <Badge variant={getStatusColor(invoice.status)}>{invoice.status}</Badge>
              </TableCell>
              <TableCell>{formatDate(invoice.invoice_date)}</TableCell>
              <TableCell>{formatDate(invoice.due_date)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/invoices/${invoice._id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye size={16} />
                    </Button>
                  </Link>
                  <Link href={`/invoices/${invoice._id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Edit2 size={16} />
                    </Button>
                  </Link>
                  {invoice.status === "draft" && onSend && (
                    <Button variant="ghost" size="sm" onClick={() => onSend(invoice.id)}>
                      <Send size={16} />
                    </Button>
                  )}
                  {onDelete && (
                    <Button variant="ghost" size="sm" onClick={() => onDelete(invoice.id)}>
                      <Trash2 size={16} className="text-destructive" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

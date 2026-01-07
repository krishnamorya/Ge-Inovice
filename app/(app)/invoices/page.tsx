/**
 * Invoices list page
 */

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useInvoices } from "@/hooks/use-invoices"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { InvoiceTable } from "@/components/invoices/invoice-table"
import { Plus, FileText } from "lucide-react"

export default function InvoicesPage() {
  const { invoices, pagination, fetchInvoices, isLoading, deleteInvoice, sendInvoice } = useInvoices()
  const [statusFilter, setStatusFilter] = useState<string>("")

  useEffect(() => {
    fetchInvoices({ status: statusFilter || "draft" })
  }, [statusFilter])
  console.log("Invoices from page.tsx:", invoices)

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      try {
        await deleteInvoice(id)
      } catch (error) {
        console.error("Failed to delete invoice:", error)
      }
    }
  }

  const handleSend = async (id: string) => {
    try {
      await sendInvoice(id)
      alert("Invoice sent successfully!")
    } catch (error) {
      console.error("Failed to send invoice:", error)
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText size={32} />
            Invoices
          </h1>
          <p className="text-muted-foreground mt-1">Manage and track your invoices</p>
        </div>
        <Link href="/invoices/create">
          <Button>
            <Plus size={16} className="mr-2" />
            New Invoice
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex gap-2">
          {["", "draft", "sent", "viewed", "paid", "cancelled"].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(status)}
            >
              {status ? status.charAt(0).toUpperCase() + status.slice(1) : "All"}
            </Button>
          ))}
        </div>
      </Card>

      {/* Invoice Table */}
      <Card className="p-6">
        <InvoiceTable invoices={invoices} isLoading={isLoading} onDelete={handleDelete} onSend={handleSend} />
      </Card>

      {/* Pagination */}
      {/* {pagination.last_page > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {pagination.current_page} of {pagination.last_page} ({pagination.total} total)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.current_page === 1}
              onClick={() => fetchInvoices({ page: pagination.current_page - 1 })}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.current_page === pagination.last_page}
              onClick={() => fetchInvoices({ page: pagination.current_page + 1 })}
            >
              Next
            </Button>
          </div>
        </div>
      )} */}
    </div>
  )
}

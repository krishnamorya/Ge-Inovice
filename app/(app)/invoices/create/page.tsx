/**
 * Create invoice page
 */

"use client"
import { useInvoices } from "@/hooks"
import { InvoiceForm } from "@/components/invoices/invoice-form"

export default function CreateInvoicePage() {
  const { createInvoice, isLoading } = useInvoices()

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Create Invoice</h1>
      <InvoiceForm onSubmit={createInvoice} isLoading={isLoading} />
    </div>
  )
}

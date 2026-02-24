/**
 * Edit invoice page
 */

"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useInvoices } from "@/hooks"
import { invoicesApi } from "@/api/invoices"
import type { Invoice } from "@/src/model/invoice"
import { InvoiceForm } from "@/components/invoices/invoice-form"

export default function EditInvoicePage() {
  const params = useParams()
  const invoiceId = params.id as string
  const { updateInvoice, isLoading: updateLoading } = useInvoices()

  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchInvoice = async () => {
      const response = await invoicesApi.getInvoice(invoiceId)
      if (response.success && response.data) {
        setInvoice(response.data)
      }
      setIsLoading(false)
    }

    fetchInvoice()
  }, [invoiceId])

  if (isLoading) {
    return <div className="p-8 text-center">Loading invoice...</div>
  }

  if (!invoice) {
    return <div className="p-8 text-center text-destructive">Invoice not found</div>
  }

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Edit Invoice</h1>
      <InvoiceForm
        initialData={invoice}
        onSubmit={(payload) => updateInvoice(invoiceId, payload)}
        isLoading={updateLoading}
      />
    </div>
  )
}

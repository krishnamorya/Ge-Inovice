/**
 * Invoice create/edit form with line items
 */

"use client"

import type React from "react"
import { useMemo } from "react"
import { useState } from "react"
import type { Invoice, CreateInvoicePayload, InvoiceLineItem } from "@/src/model/invoice"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import {Switch} from "@heroui/switch";


interface InvoiceFormProps {
  initialData?: Invoice
  onSubmit: (payload: CreateInvoicePayload) => Promise<void>
  isLoading?: boolean
}

export function InvoiceForm({ initialData, onSubmit, isLoading }: InvoiceFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<CreateInvoicePayload>({
    client_id: initialData?.client_id || "",
    invoice_date: initialData?.invoice_date || new Date().toISOString().split("T")[0],
    due_date: initialData?.due_date || "",
    line_items: initialData?.line_items || [{ description: "", quantity: 1, cost: 0, sort_order: 0 }],
    discount: initialData?.discount || 0,
   
    // notes: initialData?.notes || "",
    // terms: initialData?.terms || "",
    // public_notes: initialData?.public_notes || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isPercentage, setIsPercentage] = useState(true)
  const [status, setStatus] = useState("paid")

  const addLineItem = () => {
    setFormData((prev) => ({
      ...prev,
      line_items: [
        ...prev.line_items,
        {
          description: "",
          quantity: 1,
          cost: 0,
          sort_order: prev.line_items.length,
        },
      ],
    }))
  }

  const removeLineItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      line_items: prev.line_items.filter((_, i) => i !== index),
    }))
  }

  const updateLineItem = (index: number, field: keyof InvoiceLineItem, value: any) => {
    setFormData((prev) => {
      const newItems = [...prev.line_items]
      newItems[index] = { ...newItems[index], [field]: value }
      return { ...prev, line_items: newItems }
    })
  }



  const subtotal = useMemo(() => {
  return formData.line_items.reduce(
    (sum, item) => sum + item.quantity * item.cost,
    0
  )
}, [formData.line_items])

const total = useMemo(() => {
  if (isPercentage) {
    return subtotal - subtotal * (formData.discount / 100)
  } else {
    return subtotal - formData.discount
  }
}, [subtotal, formData.discount, isPercentage])
  

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    const newErrors: Record<string, string> = {}
    if (!formData.client_id) newErrors.client_id = "Client is required"
    if (formData.line_items.length === 0) newErrors.line_items = "At least one line item is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      await onSubmit({
      ...formData,
      amount: total,
      status: status
      })
      router.push("/invoices")
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Invoice Details</h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <Label htmlFor="client_id">Client *</Label>
            <Input
              id="client_id"
              value={formData.client_id}
              onChange={(e) => setFormData((prev) => ({ ...prev, client_id: e.target.value }))}
              placeholder="Select client"
              className={errors.client_id ? "border-destructive" : ""}
            />
            {errors.client_id && <p className="text-sm text-destructive mt-1">{errors.client_id}</p>}
          </div>
          <div>
            <Label htmlFor="invoice_date">Invoice Date *</Label>
            <Input
              id="invoice_date"
              type="date"
              value={formData.invoice_date}
              onChange={(e) => setFormData((prev) => ({ ...prev, invoice_date: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="due_date">Due Date *</Label>
            <Input
              id="due_date"
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData((prev) => ({ ...prev, due_date: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="discount">Discount</Label>
            <div className="flex">
              <Input
              id="discount"
              type="number"
              // step="0.1"
              
              min={0}
              value={formData.discount}
              onChange={(e) => setFormData((prev) => ({ ...prev, discount: Number.parseFloat(e.target.value) }))}
            />
                    <Switch
                        isSelected={isPercentage}
                        onValueChange={setIsPercentage}
                        size="sm"
                        thumbIcon={({ isSelected }) =>
                          isSelected ? "%" : "₹"
                        }
                      />
            </div>
          </div>
        </div>
      </Card>

      {/* Line Items */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Line Items</h2>
          <Button type="button" onClick={addLineItem} size="sm" variant="outline">
            <Plus size={16} className="mr-2" />
            Add Item
          </Button>
        </div>

        {errors.line_items && <p className="text-sm text-destructive mb-4">{errors.line_items}</p>}

        <div className="space-y-4">
          {formData.line_items.map((item, index) => (
            <div key={index} className="flex gap-4 items-end border border-border rounded-lg p-4">
              <div className="flex-1">
                <Label className="text-xs">Description</Label>
                <Input
                  value={item.description}
                  onChange={(e) => updateLineItem(index, "description", e.target.value)}
                  placeholder="Service or product name"
                />
              </div>
              <div className="w-24">
                <Label className="text-xs">Quantity</Label>
                <Input
                  type="number"
                  step="1"
                  value={item.quantity}
                  onChange={(e) => updateLineItem(index, "quantity", Number.parseFloat(e.target.value))}
                />
              </div>
              <div className="w-28">
                <Label className="text-xs">Unit Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={item.cost}
                  onChange={(e) => updateLineItem(index, "cost", Number.parseFloat(e.target.value))}
                />
              </div>
              <div className="w-28">
                <Label className="text-xs">Amount</Label>
                <div className="text-sm font-semibold pt-2">${(item.quantity * item.cost).toFixed(2)}</div>
              </div>
              <Button
                type="button"
                onClick={() => removeLineItem(index)}
                variant="ghost"
                size="sm"
                className="text-destructive"
              >
                <X size={16} />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Notes */}
      {/* <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Notes</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="notes">Private Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Internal notes only visible to you"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="public_notes">Public Notes</Label>
            <Textarea
              id="public_notes"
              value={formData.public_notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, public_notes: e.target.value }))}
              placeholder="Notes visible to client"
              rows={3}
            />
          </div>
        </div>
      </Card> */}
      

      {/* status paid/pending/draft*/}

      <div className="border-2 p-2 rounded-lg">
        <label htmlFor="status" className=" p-2 rounded-sm font-20 mr-10"> Select Payment Status:- </label>
        <select id="status"
        value={status} 
        onChange={(e) => setStatus(e.target.value)}
        required={true}
        aria-required={true}
        className="bg-gray-200 rounded p-1"
        >
          <option id="1" value={"pending"}>Pending</option>
          <option id="2" value={"paid"}>Paid</option>
          <option id="3" value={"draft"}>Draft</option>
        </select>
        
      </div>
      
        

      {/* Summary */}
      <Card className="p-6 bg-muted">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">Subtotal</p>
            <p className="text-lg">${subtotal.toFixed(2)}</p>

            <p className="text-sm text-muted-foreground mt-2">Total Amount</p>
            <p className="text-3xl font-bold">${total.toFixed(2)}</p>
          </div>

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Invoice"}
            </Button>
          </div>
        </div>
      </Card>
    </form>
  )
}

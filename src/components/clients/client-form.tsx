/**
 * Client form component for creating and editing
 */

"use client"

import type React from "react"

import { useState } from "react"
import type { Client } from "@/src/model/user"
import { useClients } from "@/src/hooks/use-clients"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface ClientFormProps {
  client?: Client
  onSubmit?: (client: Client) => void
}

export function ClientForm({ client, onSubmit }: ClientFormProps) {
  const [name, setName] = useState(client?.name || "")
  const [email, setEmail] = useState(client?.email || "")
  const [phone, setPhone] = useState(client?.phone || "")
  const [website, setWebsite] = useState(client?.website || "")
  const [street, setStreet] = useState(client?.street_address || "")
  const [city, setCity] = useState(client?.city || "")
  const [state, setState] = useState(client?.state || "")
  const [postalCode, setPostalCode] = useState(client?.postal_code || "")
  const [country, setCountry] = useState(client?.country || "")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const payload = {
        name,
        email,
        phone,
        website,
        street_address: street,
        city,
        state,
        postal_code: postalCode,
        country,
      }

      let result: Client
      // if (client?.id) {
      //   result = await useClients.updateClient(client.id, payload)
      // } else {
      //   result = await useClients.createClient(payload as any)
      // }

      // onSubmit?.(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save client")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>}

        <div>
          <label className="block text-sm font-medium mb-2">Company Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Company name"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Phone"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Website</label>
          <input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Street Address</label>
          <input
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Street address"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="City"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">State/Province</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="State"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Postal Code</label>
            <input
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Postal code"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Country"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Client"}
          </Button>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}

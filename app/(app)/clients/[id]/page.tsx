/**
 * Client detail page
 */

"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { clientsApi } from "@/api"
import type { Client } from "@/src/model"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function ClientDetailPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadClient = async () => {
      try {
        const data = await clientsApi.getClient(id)
        setClient(data)
      } catch (error) {
        console.error("Failed to load client:", error)
      } finally {
        setLoading(false)
      }
    }

    loadClient()
  }, [id])

  if (loading) return <div>Loading...</div>
  if (!client) return <div>Client not found</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{client.name}</h1>
        <Button onClick={() => router.push(`/clients/${client.id}/edit`)}>Edit</Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-slate-600 mb-4">Contact Information</h3>
          <div className="space-y-2">
            {client.email && (
              <div>
                <p className="text-sm text-slate-600">Email</p>
                <p className="text-sm">{client.email}</p>
              </div>
            )}
            {client.phone && (
              <div>
                <p className="text-sm text-slate-600">Phone</p>
                <p className="text-sm">{client.phone}</p>
              </div>
            )}
            {client.website && (
              <div>
                <p className="text-sm text-slate-600">Website</p>
                <p className="text-sm">
                  <a
                    href={client.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {client.website}
                  </a>
                </p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-semibold text-slate-600 mb-4">Address</h3>
          <div className="space-y-1 text-sm">
            {client.street_address && <p>{client.street_address}</p>}
            {client.city && (
              <p>
                {client.city}, {client.state} {client.postal_code}
              </p>
            )}
            {client.country && <p>{client.country}</p>}
          </div>
        </Card>
      </div>
    </div>
  )
}

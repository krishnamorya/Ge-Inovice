/**
 * Edit client page
 */

"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { clientsApi } from "@/api"
import { ClientForm } from "@/components/clients/client-form"
import type { Client } from "@/src/model"

export default function EditClientPage() {
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
        // console.error("Failed to load client:", error)
      } finally {
        setLoading(false)
      }
    }

    loadClient()
  }, [id])

  if (loading) return <div>Loading...</div>
  if (!client) return <div>Client not found</div>

  const handleSubmit = (updated: Client) => {
    router.push(`/clients/${updated.id}`)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Client</h1>
      <ClientForm client={client} onSubmit={handleSubmit} />
    </div>
  )
}

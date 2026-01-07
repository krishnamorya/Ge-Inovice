/**
 * Create client page
 */

"use client"

import { useRouter } from "next/navigation"
import { ClientForm } from "@/components/clients/client-form"
import type { Client } from "@/src/model"

export default function CreateClientPage() {
  const router = useRouter()

  const handleSubmit = (client: Client) => {
    router.push(`/clients/${client.id}`)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Create Client</h1>
      <ClientForm onSubmit={handleSubmit} />
    </div>
  )
}

"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useClients } from "@/hooks"
import { ClientTable } from "@/components/clients/client-table"
import { Button } from "@/components/ui/button"

export default function ClientsPage() {
  const { fetchClients } = useClients()
  const router = useRouter()

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Clients</h1>
        <Button onClick={() => router.push("/clients/create")}>Add Client</Button>
      </div>

      <ClientTable />
    </div>
  )
}

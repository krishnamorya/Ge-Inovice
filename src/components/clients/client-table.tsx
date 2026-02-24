/**
 * Client table component
 */

"use client"

import { useRouter } from "next/navigation"
import { useClients } from "@/hooks"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function ClientTable() {
  const { clients, loading } = useClients()
  const router = useRouter()

  if (loading) return <div className="p-4">Loading clients...</div>

  return (
    <Card className="rounded-lg">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-slate-50">
            <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Phone</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Location</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className="border-b hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium">{client.name}</td>
              <td className="px-6 py-4 text-sm">{client.email || "-"}</td>
              <td className="px-6 py-4 text-sm">{client.phone || "-"}</td>
              <td className="px-6 py-4 text-sm">{client.city ? `${client.city}, ${client.state}` : "-"}</td>
              <td className="px-6 py-4 text-sm space-x-2">
                <Button variant="outline" size="sm" onClick={() => router.push(`/clients/${client.id}`)}>
                  View
                </Button>
                <Button variant="outline" size="sm" onClick={() => router.push(`/clients/${client.id}/edit`)}>
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {clients.length === 0 && <div className="p-8 text-center text-slate-500">No clients found</div>}
    </Card>
  )
}

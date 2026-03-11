"use client"

import { User } from "@/model/user"
import { Copy, Check } from "lucide-react"
import { useState } from "react"

interface AccountInfoProps {
  user: User
}

export function AccountInfo({ user }: AccountInfoProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = async (value: string, field: string) => {
    await navigator.clipboard.writeText(value)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const InfoRow = ({
    label,
    value,
    copyable = false,
    fieldId,
  }: {
    label: string
    value: string
    copyable?: boolean
    fieldId?: string
  }) => (
    <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm text-foreground">{value}</span>
        {copyable && fieldId && (
          <button
            onClick={() => copyToClipboard(value, fieldId)}
            className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {copiedField === fieldId ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-foreground">Account Information</h3>
        <p className="text-sm text-muted-foreground">
          View your account details and identifiers.
        </p>
      </div>

      <div className="divide-y divide-border rounded-lg border border-border bg-card">
        {user.id && (
          <div className="px-4">
            <InfoRow
              label="User ID"
              value={user.id}
              copyable
              fieldId="user_id"
            />
          </div>
        )}
        {user.account_id && (
          <div className="px-4">
            <InfoRow
              label="Account ID"
              value={user.account_id}
              copyable
              fieldId="account_id"
            />
          </div>
        )}
        {user.company_id && (
          <div className="px-4">
            <InfoRow
              label="Company ID"
              value={user.company_id}
              copyable
              fieldId="company_id"
            />
          </div>
        )}
        <div className="px-4">
          <InfoRow
            label="Created"
            value={formatDate(user.created_at)}
          />
        </div>
        <div className="px-4">
          <InfoRow
            label="Last Updated"
            value={formatDate(user.updated_at)}
          />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        These identifiers are read-only and used for API integrations.
      </p>
    </div>
  )
}

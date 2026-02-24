import type React from "react"
/**
 * Layout for authentication pages
 */

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Authentication | Invoice",
  description: "Login or register to manage your invoices",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-linear-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}

import type React from "react"
/**
 * Main app layout wrapper
 */

import type { Metadata } from "next"
import { AppLayout } from "@/components/layout/app-layout"

export const metadata: Metadata = {
  title: "Dashboard | Invoice",
  description: "Manage invoices, quotes, and projects",
}

export default function AppLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppLayout>{children}</AppLayout>
}

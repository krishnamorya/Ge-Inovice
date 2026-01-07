/**
 * Client portal layout
 * Separate layout for client access with restricted views
 */

"use client"

import type { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function ClientLayout({ children }: { children: ReactNode }) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    router.push("/client/login")
  }

  return (
    <html lang="en">
      <body className="bg-slate-50">
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-slate-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-slate-900">Client Portal</h1>
              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">{children}</main>

          {/* Footer */}
          <footer className="bg-slate-100 border-t border-slate-200 mt-12">
            <div className="max-w-7xl mx-auto px-6 py-8 text-center text-slate-600 text-sm">
              <p>&copy; {new Date().getFullYear()} Invoice. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}

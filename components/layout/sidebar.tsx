/**
 * Main application sidebar navigation
 */

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  FileText,
  Receipt,
  Users,
  Settings,
  LogOut,
  LayoutDashboard,
} from "lucide-react"
import { useAuth } from "@/hooks"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/expenses", label: "Expenses", icon: Receipt },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { logout, user } = useAuth()
  // console.log(user?.first_name, user?.last_name)

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-sidebar-foreground">Invoice</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)

          return (
            <Link key={item.href} href={item.href}>
              <p
                className={cn(
                  "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </p>
            </Link>
          )
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="mb-4 pb-4 border-b border-sidebar-border">
          {user && (
            <div className="text-sm">
              <p className="font-semibold text-sidebar-foreground">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-xs text-sidebar-foreground opacity-70">{user.email}</p>
            </div>
          )}
        </div>
        <Button onClick={logout} variant="ghost" className="w-full justify-start gap-2" size="sm">
          <LogOut size={16} />
          Logout
        </Button>
      </div>
    </aside>
  )
}

"use client"
import React, { useEffect } from "react"
import { useState } from "react"
import { UpdateUserPayload, User } from "@/model/user"
import { ProfileForm } from "@/components/profile/profile-form"
import { PasswordForm } from "@/components/profile/password-form"
import { AccountInfo } from "@/components/profile/account-info"
import { SettingsNav } from "@/components/profile/settings-nav"
import { useAuth } from "@/src/hooks"
// import { NextRequest } from "next/server"
// import { ArrowLeft } from "lucide-react"


export default function ProfilePage() {

  const { updateUser, user } = useAuth()

  const [activeTab, setActiveTab] = useState("profile")

  if (!user) return null
  const [CurrentUser, setUser] = useState<User>(user)
  useEffect(() => {
    
  })

  console.log(user, "Is user to setting page.")
  
  const handleSaveProfile = async (updatedData: UpdateUserPayload) => {
    try {
      const res = await updateUser(updatedData)
      console.log(res)
    } catch (error) {
      // console.log(error)
    }
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    // setUser((prev) => ({ ...prev, ...updatedData, updated_at: new Date().toISOString() }))
    console.log("Profile updated:", updatedData)
  }

  const handleSavePassword = async (currentPassword: string, newPassword: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("Password updated")
  }

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-10">
            <ProfileForm user={CurrentUser} onSave={handleSaveProfile} />
            <div className="border-t border-border pt-10">
              <AccountInfo user={CurrentUser} />
            </div>
          </div>
        )
      case "password":
        return <PasswordForm onSave={handleSavePassword} />
      case "billing":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Billing</h3>
            <p className="text-sm text-muted-foreground">
              Manage your billing information and subscription.
            </p>
            <div className="rounded-lg border border-border bg-card p-6">
              <p className="text-center text-muted-foreground">
                Billing settings coming soon.
              </p>
            </div>
          </div>
        )
      case "notifications":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Notifications</h3>
            <p className="text-sm text-muted-foreground">
              Configure how you receive notifications.
            </p>
            <div className="rounded-lg border border-border bg-card p-6">
              <p className="text-center text-muted-foreground">
                Notification settings coming soon.
              </p>
            </div>
          </div>
        )
      case "security":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Security</h3>
            <p className="text-sm text-muted-foreground">
              Manage your security preferences and two-factor authentication.
            </p>
            <div className="rounded-lg border border-border bg-card p-6">
              <p className="text-center text-muted-foreground">
                Security settings coming soon.
              </p>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-full">
      
      {/* Main Content */}
      <main className=" max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          {/* Sidebar Navigation */}
          <aside className="lg:w-56 lg:shrink-0">
            <div className="sticky top-8">
              <SettingsNav activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
          </aside>

          {/* Content Area */}
          <div className="flex-1">
            <div className="rounded-lg border border-border bg-card p-6 sm:p-8">
              {renderContent()}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

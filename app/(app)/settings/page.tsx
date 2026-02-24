/**
 * Settings page - skeleton
 */

import { Card } from "@/components/ui/card"

export default function SettingsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="space-y-6 max-w-2xl">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Company Settings</h2>
          <p className="text-muted-foreground mb-4">Coming soon</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">User Profile</h2>
          <p className="text-muted-foreground mb-4">Coming soon</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Integrations</h2>
          <p className="text-muted-foreground mb-4">Coming soon</p>
        </Card>
      </div>
    </div>
  )
}

/**
 * Registration page
 */

"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/src/hooks"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

import * as z from "zod"
import { registerSchema } from "@/src/schema/registerSchema"
import { Form, FormLabel, FormField, FormMessage, FormItem, FormControl } from "@/components/ui/form"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const { register, error: authError, resetError } = useAuth()
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirm: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    // resetError()

    // Validation
    const newErrors: Record<string, string> = {}
    if (!formData.first_name) newErrors.first_name = "First name is required"
    if (!formData.last_name) newErrors.last_name = "Last name is required"
    if (!formData.email) newErrors.email = "Email is required"
    if (!formData.password) newErrors.password = "Password is required"
    if (formData.password !== formData.password_confirm) {
      newErrors.password_confirm = "Passwords do not match"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)

    try {
      await register(formData.email, formData.password, formData.first_name, formData.last_name)
      router.push("/dashboard")
    } catch (error) {
      setErrors({ form: error instanceof Error ? error.message : "Registration failed" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Invoice</h1>
        <p className="text-muted-foreground">Create your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {(errors.form) && (
          <div className="p-3 bg-destructive/10 border border-destructive rounded-lg text-sm text-destructive">
            {errors.form}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              value={formData.first_name}
              onChange={(e) => setFormData((prev) => ({ ...prev, first_name: e.target.value }))}
              placeholder="John"
              disabled={isLoading}
              className={errors.first_name ? "border-destructive" : ""}
            />
            {errors.first_name && <p className="text-sm text-destructive mt-1">{errors.first_name}</p>}
          </div>
          <div>
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              id="last_name"
              value={formData.last_name}
              onChange={(e) => setFormData((prev) => ({ ...prev, last_name: e.target.value }))}
              placeholder="Doe"
              disabled={isLoading}
              className={errors.last_name ? "border-destructive" : ""}
            />
            {errors.last_name && <p className="text-sm text-destructive mt-1">{errors.last_name}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="name@example.com"
            disabled={isLoading}
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
            placeholder="••••••••"
            disabled={isLoading}
            className={errors.password ? "border-destructive" : ""}
          />
          {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
        </div>

        <div>
          <Label htmlFor="password_confirm">Confirm Password</Label>
          <Input
            id="password_confirm"
            type="password"
            value={formData.password_confirm}
            onChange={(e) => setFormData((prev) => ({ ...prev, password_confirm: e.target.value }))}
            placeholder="••••••••"
            disabled={isLoading}
            className={errors.password_confirm ? "border-destructive" : ""}
          />
          {errors.password_confirm && <p className="text-sm text-destructive mt-1">{errors.password_confirm}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Sign up"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline font-semibold">
          Sign in
        </Link>
      </p>
    </Card>
  )
}

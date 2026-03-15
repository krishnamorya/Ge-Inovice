"use client"

import { useState } from "react"
import { UpdateUserPayload, User } from "@/model/user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


interface ProfileFormProps {
  user: User
  onSave: (user: UpdateUserPayload) => Promise<User>
}

export function ProfileForm({ user, onSave }: ProfileFormProps) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
  const [formData, setFormData] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone: user.phone,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [profilePicture, setProfilePicture] = useState(user.profile_picture || "")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await onSave({ ...formData, profile_picture: profilePicture })
    } finally {
      setIsSaving(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) {
      return
    }

    if (!cloudName || !uploadPreset) {
      console.error("Missing Cloudinary configuration.")
      return
    }

    setIsUploadingImage(true)

    try {
      const payload = new FormData()
      payload.append("file", file)
      payload.append("upload_preset", uploadPreset)

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: payload,
      })

      if (!response.ok) {
        throw new Error("Failed to upload image to Cloudinary.")
      }

      const data = await response.json()
      setProfilePicture(data.secure_url || "")
    } catch (error) {
      console.error("Cloudinary upload error:", error)
    } finally {
      setIsUploadingImage(false)
      e.target.value = ""
    }
  }



  const getInitials = () => {
    return `${formData.first_name.charAt(0)}${formData.last_name.charAt(0)}`.toUpperCase()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Profile Picture Section */}
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <div className="relative group">
          <Avatar className="h-24 w-24 border-2 border-border">
            <AvatarImage src={profilePicture} alt={`${formData.first_name} ${formData.last_name}`} />
            <AvatarFallback className="bg-muted text-2xl font-medium">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <label
            htmlFor="profile-picture"
            className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-background/80 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <Camera className="h-6 w-6 text-foreground" />
          </label>
          <input
            id="profile-picture"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          


        </div>
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-medium text-foreground">Profile Picture</h3>
          <p className="text-sm text-muted-foreground">
            Click on the avatar to upload a new profile picture.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {isUploadingImage ? "Uploading image..." : "JPG, PNG or GIF. Max size 2MB."}
          </p>
        </div>
      </div>

      {/* Personal Information */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-foreground">Personal Information</h3>
          <p className="text-sm text-muted-foreground">
            Update your personal details here.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="Enter your first name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Enter your last name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          <p className="text-xs text-muted-foreground">
            This email will be used for account-related notifications.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end border-t border-border pt-6">
        <Button type="submit" disabled={isSaving || isUploadingImage}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isUploadingImage && !isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}

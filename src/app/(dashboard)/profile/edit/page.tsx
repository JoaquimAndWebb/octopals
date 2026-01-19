"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Camera, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProfileForm } from "@/components/user/profile-form"
import { useToast } from "@/components/ui/use-toast"
import type { UpdateProfileInput } from "@/lib/validations/user"
import type { SkillLevel, Position } from "@/lib/constants"

// Mock user data
const mockUser = {
  id: "current-user",
  firstName: "Alex",
  lastName: "Chen",
  imageUrl: null,
  coverImageUrl: null,
  bio: "Passionate underwater hockey player with 5 years of experience. Love the strategic depth of the sport and the amazing community.",
  location: "Sydney, Australia",
  skillLevel: "ADVANCED" as SkillLevel,
  primaryPosition: "FORWARD" as Position,
  yearsPlaying: 5,
}

export default function EditProfilePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (data: UpdateProfileInput) => {
    setIsSubmitting(true)
    try {
      // In production, save to database via API
      console.log("Saving profile:", data)
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call

      toast({
        title: "Profile updated!",
        description: "Your changes have been saved successfully.",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploadingImage(true)
    try {
      // In production, upload to storage
      console.log("Uploading image:", file.name)
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate upload

      toast({
        title: "Photo updated!",
        description: "Your profile photo has been updated.",
      })
    } catch {
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploadingImage(false)
    }
  }

  const user = mockUser

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/profile"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Profile
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Edit Profile</h1>
        <p className="mt-1 text-muted-foreground">
          Update your profile information and settings
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm
                initialData={{
                  firstName: user.firstName,
                  lastName: user.lastName,
                  bio: user.bio,
                  location: user.location,
                  skillLevel: user.skillLevel,
                  primaryPosition: user.primaryPosition,
                  yearsPlaying: user.yearsPlaying,
                }}
                onSubmit={handleSubmit}
                loading={isSubmitting}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Photo Upload */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Photo</CardTitle>
              <CardDescription>
                Upload a photo for your profile
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={user.imageUrl || undefined} />
                  <AvatarFallback className="text-3xl">
                    {user.firstName?.charAt(0)}
                    {user.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="photo-upload"
                  className="absolute bottom-0 right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
                >
                  {isUploadingImage ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Camera className="h-5 w-5" />
                  )}
                </label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={isUploadingImage}
                />
              </div>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Click the camera icon to upload a new photo
              </p>
              <p className="text-xs text-muted-foreground">
                Recommended: Square image, at least 200x200px
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cover Photo</CardTitle>
              <CardDescription>
                Add a cover photo to your profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                {user.coverImageUrl ? (
                  <img
                    src={user.coverImageUrl}
                    alt="Cover"
                    className="h-full w-full object-cover rounded-lg"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">No cover photo</p>
                )}
              </div>
              <Button variant="outline" className="mt-4 w-full">
                <Camera className="mr-2 h-4 w-4" />
                Upload Cover Photo
              </Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <Button variant="destructive" className="w-full">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Save, Upload, Trash2, Globe, Lock, Users, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

interface SettingsPageProps {
  params: Promise<{ clubId: string }>
}

// Mock data
const mockClub = {
  name: "Sydney Stingrays",
  description: "Sydney Stingrays is one of Australia's premier underwater hockey clubs. Founded in 1985, we have a rich history of developing players from complete beginners to national team representatives.",
  website: "https://sydneystingrays.com",
  email: "info@sydneystingrays.com",
  phone: "+61 2 9999 9999",
  address: "Sydney Aquatic Centre, Olympic Park, NSW 2127",
  visibility: "public",
  membershipApproval: "manual",
  welcomesBeginners: true,
  hasEquipment: true,
  maxMembers: 100,
}

export default function ClubSettingsPage(_props: SettingsPageProps) {
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)

  // Form state
  const [name, setName] = useState(mockClub.name)
  const [description, setDescription] = useState(mockClub.description)
  const [website, setWebsite] = useState(mockClub.website)
  const [email, setEmail] = useState(mockClub.email)
  const [phone, setPhone] = useState(mockClub.phone)
  const [address, setAddress] = useState(mockClub.address)
  const [visibility, setVisibility] = useState(mockClub.visibility)
  const [membershipApproval, setMembershipApproval] = useState(mockClub.membershipApproval)
  const [welcomesBeginners, setWelcomesBeginners] = useState(mockClub.welcomesBeginners)
  const [hasEquipment, setHasEquipment] = useState(mockClub.hasEquipment)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // In production, save to database
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast({
        title: "Settings saved",
        description: "Your club settings have been updated.",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="../"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Admin Dashboard
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Club Settings</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your club profile and preferences
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Update your club&apos;s public profile information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Club Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Contact Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Training Location</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Club Images */}
        <Card>
          <CardHeader>
            <CardTitle>Club Images</CardTitle>
            <CardDescription>
              Upload your club logo and cover image
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Club Logo</Label>
                <div className="aspect-square rounded-lg border-2 border-dashed flex items-center justify-center bg-muted">
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Click to upload logo
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Cover Image</Label>
                <div className="aspect-video rounded-lg border-2 border-dashed flex items-center justify-center bg-muted">
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Click to upload cover
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Access */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Privacy & Access
            </CardTitle>
            <CardDescription>
              Control who can find and join your club
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="visibility">Club Visibility</Label>
                  <p className="text-sm text-muted-foreground">
                    Who can find your club in search results
                  </p>
                </div>
              </div>
              <Select value={visibility} onValueChange={setVisibility}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="unlisted">Unlisted</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="membership">Membership Approval</Label>
                  <p className="text-sm text-muted-foreground">
                    How new members can join your club
                  </p>
                </div>
              </div>
              <Select value={membershipApproval} onValueChange={setMembershipApproval}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto-approve</SelectItem>
                  <SelectItem value="manual">Manual approval</SelectItem>
                  <SelectItem value="invite">Invite only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Club Features */}
        <Card>
          <CardHeader>
            <CardTitle>Club Features</CardTitle>
            <CardDescription>
              Toggle features that appear on your club profile
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="beginners">Welcomes Beginners</Label>
                <p className="text-sm text-muted-foreground">
                  Show that your club is beginner-friendly
                </p>
              </div>
              <Switch
                id="beginners"
                checked={welcomesBeginners}
                onCheckedChange={setWelcomesBeginners}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="equipment">Has Equipment</Label>
                <p className="text-sm text-muted-foreground">
                  Indicate that your club provides equipment for members
                </p>
              </div>
              <Switch
                id="equipment"
                checked={hasEquipment}
                onCheckedChange={setHasEquipment}
              />
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Irreversible actions for your club
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-destructive/30 p-4">
              <div>
                <p className="font-medium">Transfer Ownership</p>
                <p className="text-sm text-muted-foreground">
                  Transfer club ownership to another admin
                </p>
              </div>
              <Button variant="outline">Transfer</Button>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-destructive/30 p-4">
              <div>
                <p className="font-medium">Archive Club</p>
                <p className="text-sm text-muted-foreground">
                  Archive this club and all its data
                </p>
              </div>
              <Button variant="outline">Archive</Button>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-destructive p-4 bg-destructive/5">
              <div>
                <p className="font-medium text-destructive">Delete Club</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete this club and all associated data
                </p>
              </div>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, ArrowRight, ArrowLeft, MapPin, Dumbbell, Users, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SkillLevelSelector } from "@/components/user/skill-level-selector"
import {
  POSITIONS,
  POSITION_LABELS,
  type SkillLevel,
  type Position,
} from "@/lib/constants"

const steps = [
  { id: 1, title: "Welcome", description: "Tell us about yourself" },
  { id: 2, title: "Experience", description: "Your underwater hockey background" },
  { id: 3, title: "Location", description: "Help us find clubs near you" },
  { id: 4, title: "Complete", description: "You're all set!" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form data
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [bio, setBio] = useState("")
  const [skillLevel, setSkillLevel] = useState<SkillLevel | undefined>()
  const [primaryPosition, setPrimaryPosition] = useState<Position | undefined>()
  const [yearsPlaying, setYearsPlaying] = useState("")
  const [location, setLocation] = useState("")

  const progress = (currentStep / steps.length) * 100

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return firstName.trim().length > 0
      case 2:
        return skillLevel !== undefined
      case 3:
        return location.trim().length > 0
      default:
        return true
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    setIsSubmitting(true)
    try {
      // In production, save profile data
      console.log("Saving onboarding data:", {
        firstName,
        lastName,
        bio,
        skillLevel,
        primaryPosition,
        yearsPlaying: parseInt(yearsPlaying) || 0,
        location,
      })
      await new Promise((resolve) => setTimeout(resolve, 1500))
      router.push("/dashboard")
    } catch (error) {
      console.error("Onboarding error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 sm:p-8">
      <div className="mx-auto max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-sm font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <Card className="shadow-lg">
          {currentStep === 1 && (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Welcome to OctoPals!</CardTitle>
                <CardDescription>
                  Let&apos;s set up your profile so you can connect with the underwater hockey community.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Your last name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">About You (Optional)</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell other players a bit about yourself..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </>
          )}

          {currentStep === 2 && (
            <>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Dumbbell className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Your Experience</CardTitle>
                <CardDescription>
                  Help us match you with the right clubs and players.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Skill Level *</Label>
                  <SkillLevelSelector
                    value={skillLevel}
                    onChange={setSkillLevel}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Preferred Position</Label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {(Object.keys(POSITIONS) as Position[]).map((position) => (
                      <button
                        key={position}
                        type="button"
                        onClick={() => setPrimaryPosition(position)}
                        className={`rounded-lg border p-3 text-center text-sm transition-colors ${
                          primaryPosition === position
                            ? "border-primary bg-primary/10 text-primary"
                            : "hover:bg-accent"
                        }`}
                      >
                        {POSITION_LABELS[position]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearsPlaying">Years Playing</Label>
                  <Input
                    id="yearsPlaying"
                    type="number"
                    min="0"
                    max="50"
                    value={yearsPlaying}
                    onChange={(e) => setYearsPlaying(e.target.value)}
                    placeholder="0"
                  />
                </div>
              </CardContent>
            </>
          )}

          {currentStep === 3 && (
            <>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Your Location</CardTitle>
                <CardDescription>
                  This helps us find clubs and players near you.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="location">City or Region *</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Sydney, Australia"
                  />
                  <p className="text-xs text-muted-foreground">
                    You can be as specific or general as you like.
                  </p>
                </div>

                <div className="rounded-lg border border-dashed p-6 text-center">
                  <MapPin className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Or use your current location
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Detect Location
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {currentStep === 4 && (
            <>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl">You&apos;re All Set!</CardTitle>
                <CardDescription>
                  Your profile is ready. Time to dive in!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg bg-muted p-4">
                  <h3 className="font-medium">What&apos;s Next?</h3>
                  <ul className="mt-3 space-y-3">
                    <li className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm">Find and join clubs near you</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <Dumbbell className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm">Start tracking your training</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm">RSVP to your first session</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </>
          )}

          {/* Navigation */}
          <div className="flex justify-between border-t p-6">
            {currentStep > 1 && currentStep < 4 ? (
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <Button onClick={handleNext} disabled={!canProceed()}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleComplete} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

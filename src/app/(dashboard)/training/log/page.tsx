"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrainingLogForm, type TrainingLogFormData } from "@/components/training/training-log-form"
import { TrainingHistory } from "@/components/training/training-history"
import { useToast } from "@/components/ui/use-toast"

// Mock data
const mockHistory = [
  {
    id: "1",
    trainingType: "pool_session" as const,
    date: new Date(Date.now() - 86400000),
    duration: 90,
    intensity: 7,
    notes: "Good scrimmage session. Worked on stick handling.",
  },
  {
    id: "2",
    trainingType: "static_apnea" as const,
    date: new Date(Date.now() - 2 * 86400000),
    duration: 45,
    intensity: 5,
    notes: "Breath hold practice. New PB of 2:15!",
  },
  {
    id: "3",
    trainingType: "dry_training" as const,
    date: new Date(Date.now() - 4 * 86400000),
    duration: 60,
    intensity: 8,
    notes: "Gym workout focusing on core and cardio.",
  },
  {
    id: "4",
    trainingType: "co2_table" as const,
    date: new Date(Date.now() - 5 * 86400000),
    duration: 30,
    intensity: 6,
    notes: "CO2 tolerance training.",
  },
  {
    id: "5",
    trainingType: "pool_session" as const,
    date: new Date(Date.now() - 7 * 86400000),
    duration: 120,
    intensity: 8,
    notes: "Full training session with the club.",
  },
]

export default function TrainingLogPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (data: TrainingLogFormData) => {
    setIsSubmitting(true)
    try {
      // In production, save to database
      console.log("Saving training log:", data)
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

      toast({
        title: "Training logged!",
        description: "Your training session has been recorded.",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to log training. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalSessions = mockHistory.length
  const totalMinutes = mockHistory.reduce((sum, h) => sum + h.duration, 0)
  const avgIntensity =
    mockHistory.reduce((sum, h) => sum + h.intensity, 0) / mockHistory.length

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/training"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Training Hub
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Training Log</h1>
        <p className="mt-1 text-muted-foreground">
          Record your training sessions and track your history
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSessions} sessions</div>
            <p className="text-xs text-muted-foreground">
              {Math.round(totalMinutes / 60)} hours total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(totalMinutes / totalSessions)} min
            </div>
            <p className="text-xs text-muted-foreground">Per session</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Intensity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgIntensity.toFixed(1)}/10</div>
            <p className="text-xs text-muted-foreground">Moderate effort</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="log" className="space-y-6">
        <TabsList>
          <TabsTrigger value="log">
            <Plus className="mr-2 h-4 w-4" />
            Log New
          </TabsTrigger>
          <TabsTrigger value="history">
            History ({mockHistory.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="log">
          <Card>
            <CardHeader>
              <CardTitle>Log Training Session</CardTitle>
              <CardDescription>
                Record the details of your training session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TrainingLogForm
                onSubmit={handleSubmit}
                loading={isSubmitting}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Training History</CardTitle>
                <CardDescription>
                  Your past training sessions
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </CardHeader>
            <CardContent>
              <TrainingHistory logs={mockHistory} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

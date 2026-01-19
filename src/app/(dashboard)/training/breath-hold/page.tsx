"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { ArrowLeft, Settings, History, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { BreathHoldTimer, type TimerPhase } from "@/components/training/breath-hold-timer"
import { formatSeconds } from "@/lib/utils"

// Mock history
const recentHolds = [
  { id: "1", duration: 135, date: new Date(Date.now() - 86400000) },
  { id: "2", duration: 128, date: new Date(Date.now() - 2 * 86400000) },
  { id: "3", duration: 142, date: new Date(Date.now() - 3 * 86400000) },
  { id: "4", duration: 130, date: new Date(Date.now() - 5 * 86400000) },
]

export default function BreathHoldPage() {
  const [breatheUpDuration, setBreatheUpDuration] = useState(120)
  const [currentPhase, setCurrentPhase] = useState<TimerPhase>("idle")
  const [lastHoldTime, setLastHoldTime] = useState<number | null>(null)
  const [showSettings, setShowSettings] = useState(false)

  const handleComplete = useCallback((holdTime: number) => {
    setLastHoldTime(holdTime)
    // In production, save to database
    console.log("Breath hold completed:", holdTime, "seconds")
  }, [])

  const handlePhaseChange = useCallback((phase: TimerPhase) => {
    setCurrentPhase(phase)
  }, [])

  const personalBest = Math.max(...recentHolds.map((h) => h.duration))
  const averageHold =
    recentHolds.reduce((sum, h) => sum + h.duration, 0) / recentHolds.length

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Breath Hold Timer
          </h1>
          <p className="mt-1 text-muted-foreground">
            Practice and track your static apnea holds
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Timer */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="py-8">
              <BreathHoldTimer
                breatheUpDuration={breatheUpDuration}
                onComplete={handleComplete}
                onPhaseChange={handlePhaseChange}
              />

              {lastHoldTime !== null && currentPhase === "recover" && (
                <div className="mt-8 rounded-lg bg-green-50 p-4 text-center">
                  <p className="text-sm text-green-600">Great job!</p>
                  <p className="text-2xl font-bold text-green-700">
                    {formatSeconds(lastHoldTime)}
                  </p>
                  <p className="mt-1 text-sm text-green-600">
                    {lastHoldTime >= personalBest
                      ? "New personal best!"
                      : `${personalBest - lastHoldTime}s from your best`}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Settings Panel */}
          {showSettings && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Timer Settings</CardTitle>
                <CardDescription>
                  Customize your breath hold session
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="breatheUp">Breathe Up Duration (seconds)</Label>
                  <Input
                    id="breatheUp"
                    type="number"
                    min={30}
                    max={300}
                    value={breatheUpDuration}
                    onChange={(e) => setBreatheUpDuration(parseInt(e.target.value) || 120)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended: 2-3 minutes of calm breathing before holding
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Info className="h-5 w-5" />
                How to Use
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600">
                  1
                </span>
                <p>
                  <strong>Breathe Up:</strong> Take slow, deep breaths to oxygenate your
                  blood. The timer will count down your breathe-up phase.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-medium text-red-600">
                  2
                </span>
                <p>
                  <strong>Hold:</strong> When you hear the beep, take your final breath
                  and hold. The timer will count up during your hold.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-medium text-green-600">
                  3
                </span>
                <p>
                  <strong>Stop:</strong> Press the stop button when you need to breathe.
                  Your hold time will be recorded.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Personal Best</span>
                <span className="text-xl font-bold text-primary">
                  {formatSeconds(personalBest)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Average Hold</span>
                <span className="text-xl font-bold">
                  {formatSeconds(Math.round(averageHold))}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Holds</span>
                <span className="text-xl font-bold">{recentHolds.length}</span>
              </div>
            </CardContent>
          </Card>

          {/* Recent History */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Holds</CardTitle>
              <History className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentHolds.map((hold) => (
                  <div
                    key={hold.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground">
                      {hold.date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="font-medium">{formatSeconds(hold.duration)}</span>
                  </div>
                ))}
              </div>
              <Button asChild variant="outline" className="mt-4 w-full">
                <Link href="/training/progress">View All Progress</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Safety Tips */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-lg text-yellow-800">Safety First</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-yellow-700">
              <ul className="space-y-2">
                <li>Never practice breath holds in water alone</li>
                <li>Stop if you feel dizzy or unwell</li>
                <li>Don&apos;t hyperventilate before holds</li>
                <li>Stay hydrated and rested</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

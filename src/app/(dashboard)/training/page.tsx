"use client"

import { useState } from "react"
import Link from "next/link"
import { Dumbbell, Clock, TrendingUp, Target, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatsOverview, type TrainingStats } from "@/components/training/stats-overview"
import { PersonalBestCard } from "@/components/training/personal-best-card"

// Mock data
const mockStats: TrainingStats = {
  sessionsThisWeek: 3,
  sessionsThisMonth: 12,
  totalTrainingTimeThisWeek: 270, // 4.5 hours
  totalTrainingTimeThisMonth: 1080, // 18 hours
  breathHoldImprovement: 12.5,
  currentBestHold: 135, // 2:15
  previousBestHold: 120, // 2:00
  averageIntensity: 6.5,
}

const recentTraining = [
  {
    id: "1",
    type: "Pool Session",
    date: new Date(Date.now() - 86400000),
    duration: 90,
    intensity: 7,
  },
  {
    id: "2",
    type: "Static Apnea",
    date: new Date(Date.now() - 2 * 86400000),
    duration: 45,
    intensity: 5,
  },
  {
    id: "3",
    type: "Dry Training",
    date: new Date(Date.now() - 4 * 86400000),
    duration: 60,
    intensity: 8,
  },
]

const quickActions = [
  {
    title: "Breath Hold Timer",
    description: "Start a timed breath hold session",
    href: "/training/breath-hold",
    icon: Clock,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Log Training",
    description: "Record a training session",
    href: "/training/log",
    icon: Plus,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "View Progress",
    description: "See your improvement over time",
    href: "/training/progress",
    icon: TrendingUp,
    color: "bg-purple-100 text-purple-600",
  },
]

export default function TrainingPage() {
  const [period, setPeriod] = useState<"week" | "month">("week")

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Training Hub</h1>
          <p className="mt-1 text-muted-foreground">
            Track your training, improve your breath hold, and monitor your progress
          </p>
        </div>
        <Button asChild>
          <Link href="/training/log">
            <Plus className="mr-2 h-4 w-4" />
            Log Training
          </Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Overview</h2>
          <div className="flex rounded-lg border p-1">
            <Button
              variant={period === "week" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setPeriod("week")}
            >
              This Week
            </Button>
            <Button
              variant={period === "month" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setPeriod("month")}
            >
              This Month
            </Button>
          </div>
        </div>
        <StatsOverview stats={mockStats} period={period} />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        {quickActions.map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.title}
              href={action.href}
              className="group rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className={`inline-flex rounded-lg p-3 ${action.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold group-hover:text-primary">
                {action.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {action.description}
              </p>
            </Link>
          )
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Training */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Training</CardTitle>
              <CardDescription>Your latest training sessions</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/training/log">
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentTraining.length > 0 ? (
              <div className="space-y-4">
                {recentTraining.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Dumbbell className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{session.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {session.date.toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{session.duration} min</p>
                      <p className="text-sm text-muted-foreground">
                        Intensity: {session.intensity}/10
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <Dumbbell className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
                <p>No recent training sessions</p>
                <Button asChild variant="link" className="mt-2">
                  <Link href="/training/log">Log your first session</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Personal Bests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Personal Bests</CardTitle>
              <CardDescription>Your record achievements</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/training/progress">
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <PersonalBestCard
                metricName="Static Breath Hold"
                value={135}
                unit="seconds"
                dateAchieved={new Date(Date.now() - 3 * 86400000)}
                previousBest={115}
                icon="trophy"
              />
              <PersonalBestCard
                metricName="Dynamic Apnea"
                value={75}
                unit="meters"
                dateAchieved={new Date(Date.now() - 10 * 86400000)}
                previousBest={65}
                icon="award"
              />
              <PersonalBestCard
                metricName="Longest Training Week"
                value={6}
                unit="sessions"
                dateAchieved={new Date(Date.now() - 30 * 86400000)}
                icon="trending"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Training Tips */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Training Tip of the Day
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Focus on relaxation during breath holds. Tension consumes oxygen faster.
            Practice meditation techniques to lower your heart rate before attempting
            long holds. Start with shorter, relaxed holds and gradually increase duration.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, TrendingUp, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProgressChart, type DataPoint } from "@/components/training/progress-chart"
import { Badge } from "@/components/ui/badge"

// Mock data
const breathHoldData: DataPoint[] = [
  { date: new Date(Date.now() - 30 * 86400000), value: 90, label: "Starting point" },
  { date: new Date(Date.now() - 25 * 86400000), value: 95 },
  { date: new Date(Date.now() - 20 * 86400000), value: 105 },
  { date: new Date(Date.now() - 15 * 86400000), value: 100 },
  { date: new Date(Date.now() - 10 * 86400000), value: 115 },
  { date: new Date(Date.now() - 5 * 86400000), value: 125 },
  { date: new Date(Date.now() - 2 * 86400000), value: 135, label: "New PB!" },
]

const trainingVolumeData = [
  { week: "Week 1", sessions: 2, minutes: 180 },
  { week: "Week 2", sessions: 3, minutes: 270 },
  { week: "Week 3", sessions: 3, minutes: 300 },
  { week: "Week 4", sessions: 4, minutes: 360 },
]

const milestones = [
  {
    title: "First 2-minute hold",
    date: new Date(Date.now() - 10 * 86400000),
    achieved: true,
  },
  {
    title: "10 training sessions",
    date: new Date(Date.now() - 15 * 86400000),
    achieved: true,
  },
  {
    title: "Consistent weekly training",
    date: new Date(Date.now() - 7 * 86400000),
    achieved: true,
  },
  {
    title: "2:30 breath hold",
    date: null,
    achieved: false,
  },
  {
    title: "20 training sessions",
    date: null,
    achieved: false,
  },
]

export default function ProgressPage() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month")

  const improvementPercentage = Math.round(
    ((breathHoldData[breathHoldData.length - 1].value - breathHoldData[0].value) /
      breathHoldData[0].value) *
      100
  )

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
            Progress Tracking
          </h1>
          <p className="mt-1 text-muted-foreground">
            Monitor your improvement over time
          </p>
        </div>
        <div className="flex rounded-lg border p-1">
          <Button
            variant={timeRange === "week" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setTimeRange("week")}
          >
            Week
          </Button>
          <Button
            variant={timeRange === "month" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setTimeRange("month")}
          >
            Month
          </Button>
          <Button
            variant={timeRange === "year" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setTimeRange("year")}
          >
            Year
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Best
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">2:15</div>
            <p className="text-xs text-muted-foreground">Static breath hold</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-2xl font-bold text-green-600">
              <TrendingUp className="h-5 w-5" />
              {improvementPercentage}%
            </div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Training Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18.5h</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="breath-hold" className="space-y-6">
        <TabsList>
          <TabsTrigger value="breath-hold">Breath Hold</TabsTrigger>
          <TabsTrigger value="volume">Training Volume</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
        </TabsList>

        <TabsContent value="breath-hold">
          <Card>
            <CardHeader>
              <CardTitle>Breath Hold Progress</CardTitle>
              <CardDescription>
                Your static apnea times over the past {timeRange}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProgressChart
                data={breathHoldData}
                title=""
                height={300}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="volume">
          <Card>
            <CardHeader>
              <CardTitle>Training Volume</CardTitle>
              <CardDescription>
                Sessions and time spent training
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trainingVolumeData.map((week) => (
                  <div key={week.week} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{week.week}</span>
                      <span className="text-sm text-muted-foreground">
                        {week.sessions} sessions ({Math.round(week.minutes / 60)}h)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${(week.minutes / 400) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones">
          <Card>
            <CardHeader>
              <CardTitle>Milestones</CardTitle>
              <CardDescription>
                Track your achievements and goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-4 rounded-lg border p-4 ${
                      milestone.achieved ? "" : "opacity-60"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        milestone.achieved
                          ? "bg-green-100 text-green-600"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Target className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{milestone.title}</p>
                      {milestone.date ? (
                        <p className="text-sm text-muted-foreground">
                          Achieved on{" "}
                          {milestone.date.toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">In progress</p>
                      )}
                    </div>
                    <Badge variant={milestone.achieved ? "default" : "outline"}>
                      {milestone.achieved ? "Achieved" : "Goal"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Insights */}
      <Card className="bg-gradient-to-br from-blue-50 to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            <strong>Great progress!</strong> Your breath hold has improved by{" "}
            {improvementPercentage}% over the last month.
          </p>
          <p>
            You&apos;re training an average of 3 times per week. Consistency is key to
            continued improvement.
          </p>
          <p>
            <strong>Next goal:</strong> Push for a 2:30 breath hold. Based on your
            current trajectory, you could reach this in about 2-3 weeks.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

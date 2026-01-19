import type { Metadata } from "next"
import Link from "next/link"
import { Calendar, Users, Dumbbell, Trophy, Plus, ChevronRight, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { APP_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: `Dashboard - ${APP_NAME}`,
  description: "Your personal underwater hockey dashboard",
}

// Mock data
const upcomingSessions = [
  {
    id: "1",
    title: "Tuesday Training",
    clubName: "Sydney Stingrays",
    date: new Date(Date.now() + 86400000), // Tomorrow
    time: "7:00 PM",
    location: "Sydney Aquatic Centre",
    attendeeCount: 12,
    maxAttendees: 20,
    rsvpStatus: "YES",
  },
  {
    id: "2",
    title: "Saturday Scrimmage",
    clubName: "Sydney Stingrays",
    date: new Date(Date.now() + 4 * 86400000),
    time: "9:00 AM",
    location: "Sydney Aquatic Centre",
    attendeeCount: 18,
    maxAttendees: 24,
    rsvpStatus: null,
  },
]

const userClubs = [
  {
    id: "1",
    name: "Sydney Stingrays",
    role: "Member",
    imageUrl: null,
    nextSession: "Tomorrow at 7:00 PM",
  },
  {
    id: "2",
    name: "Blue Mountains UWH",
    role: "Coach",
    imageUrl: null,
    nextSession: "Thursday at 6:30 PM",
  },
]

const quickActions = [
  { label: "Log Training", href: "/training/log", icon: Dumbbell },
  { label: "Find Clubs", href: "/clubs", icon: MapPin },
  { label: "Breath Hold", href: "/training/breath-hold", icon: Clock },
  { label: "Competitions", href: "/competitions", icon: Trophy },
]

const recentActivity = [
  { type: "session", text: "RSVP'd to Tuesday Training", time: "2 hours ago" },
  { type: "training", text: "Logged 45 min pool session", time: "Yesterday" },
  { type: "achievement", text: "New personal best: 2:15 breath hold", time: "3 days ago" },
  { type: "social", text: "Maria S. joined Sydney Stingrays", time: "1 week ago" },
]

export default function DashboardPage() {
  // In production, get user data from auth context
  const userName = "Alex"

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome back, {userName}!
          </h1>
          <p className="mt-1 text-muted-foreground">
            Here&apos;s what&apos;s happening with your underwater hockey.
          </p>
        </div>
        <Button asChild>
          <Link href="/sessions">
            <Calendar className="mr-2 h-4 w-4" />
            View All Sessions
          </Link>
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {quickActions.map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.label}
              href={action.href}
              className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4 text-center shadow-sm transition-colors hover:bg-accent"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium">{action.label}</span>
            </Link>
          )
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-8 lg:col-span-2">
          {/* Upcoming Sessions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Upcoming Sessions</CardTitle>
                <CardDescription>Your next training sessions</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href="/sessions">
                  View All
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingSessions.length > 0 ? (
                upcomingSessions.map((session) => (
                  <Link
                    key={session.id}
                    href={`/sessions/${session.id}`}
                    className="block rounded-lg border p-4 transition-colors hover:bg-accent"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{session.title}</h3>
                          {session.rsvpStatus === "YES" && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              Going
                            </Badge>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {session.clubName}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {session.date.toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {session.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {session.attendeeCount}/{session.maxAttendees}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <Calendar className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
                  <p>No upcoming sessions</p>
                  <Button asChild variant="link" className="mt-2">
                    <Link href="/clubs">Find a club to join</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Your Clubs */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Your Clubs</CardTitle>
                <CardDescription>Clubs you&apos;re a member of</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href="/clubs">
                  Find Clubs
                  <Plus className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {userClubs.length > 0 ? (
                userClubs.map((club) => (
                  <Link
                    key={club.id}
                    href={`/clubs/${club.id}`}
                    className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-accent"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={club.imageUrl || undefined} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {club.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{club.name}</h3>
                        <Badge variant="outline">{club.role}</Badge>
                      </div>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        Next: {club.nextSession}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </Link>
                ))
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <Users className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
                  <p>You haven&apos;t joined any clubs yet</p>
                  <Button asChild variant="link" className="mt-2">
                    <Link href="/clubs">Find clubs near you</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Training Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Training This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-primary/10 p-3 text-center">
                  <p className="text-2xl font-bold text-primary">3</p>
                  <p className="text-xs text-muted-foreground">Sessions</p>
                </div>
                <div className="rounded-lg bg-primary/10 p-3 text-center">
                  <p className="text-2xl font-bold text-primary">4.5h</p>
                  <p className="text-xs text-muted-foreground">Total Time</p>
                </div>
                <div className="rounded-lg bg-primary/10 p-3 text-center">
                  <p className="text-2xl font-bold text-primary">2:15</p>
                  <p className="text-xs text-muted-foreground">Best Hold</p>
                </div>
                <div className="rounded-lg bg-primary/10 p-3 text-center">
                  <p className="text-2xl font-bold text-primary">6.5</p>
                  <p className="text-xs text-muted-foreground">Avg Intensity</p>
                </div>
              </div>
              <Button asChild variant="outline" className="mt-4 w-full">
                <Link href="/training/progress">
                  View Progress
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <div className="flex-1">
                      <p className="text-sm">{activity.text}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Competition */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Trophy className="h-5 w-5 text-primary" />
                Upcoming Competition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold">NSW State Championships</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                March 15-17, 2024
              </p>
              <p className="text-sm text-muted-foreground">Sydney Olympic Park</p>
              <Button asChild variant="outline" className="mt-4 w-full">
                <Link href="/competitions">
                  View Details
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

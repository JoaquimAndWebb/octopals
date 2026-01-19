"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Calendar, Search, MoreHorizontal, Edit, Trash2, Copy, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CreateSessionForm } from "@/components/sessions/create-session-form"
import { SESSION_TYPE_LABELS, type SessionType } from "@/lib/constants"

interface SessionsPageProps {
  params: Promise<{ clubId: string }>
}

// Mock data
const mockSessions = [
  {
    id: "1",
    title: "Tuesday Training",
    type: "TRAINING" as SessionType,
    date: new Date(Date.now() + 86400000),
    startTime: "19:00",
    endTime: "21:00",
    location: "Sydney Aquatic Centre",
    attendeeCount: 12,
    maxAttendees: 20,
    status: "upcoming",
  },
  {
    id: "2",
    title: "Saturday Scrimmage",
    type: "SCRIMMAGE" as SessionType,
    date: new Date(Date.now() + 4 * 86400000),
    startTime: "09:00",
    endTime: "11:00",
    location: "Sydney Aquatic Centre",
    attendeeCount: 18,
    maxAttendees: 24,
    status: "upcoming",
  },
  {
    id: "3",
    title: "Beginner Introduction",
    type: "BEGINNER_INTRO" as SessionType,
    date: new Date(Date.now() + 7 * 86400000),
    startTime: "10:00",
    endTime: "12:00",
    location: "Sydney Aquatic Centre",
    attendeeCount: 8,
    maxAttendees: 12,
    status: "upcoming",
  },
]

const pastSessions = [
  {
    id: "p1",
    title: "Thursday Training",
    type: "TRAINING" as SessionType,
    date: new Date(Date.now() - 3 * 86400000),
    startTime: "19:00",
    endTime: "21:00",
    location: "Sydney Aquatic Centre",
    attendeeCount: 15,
    maxAttendees: 20,
    status: "completed",
  },
]

export default function SessionsPage(_props: SessionsPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const filteredSessions = mockSessions.filter((session) =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateSession = async (data: unknown) => {
    console.log("Creating session:", data)
    setIsCreateDialogOpen(false)
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
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Session Management</h1>
          <p className="mt-1 text-muted-foreground">
            Create and manage training sessions
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Session
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Session</DialogTitle>
              <DialogDescription>
                Set up a new training session for your club members.
              </DialogDescription>
            </DialogHeader>
            <CreateSessionForm
              onSubmit={handleCreateSession}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Upcoming Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSessions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="upcoming" className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="upcoming">
              Upcoming ({mockSessions.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({pastSessions.length})
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <TabsContent value="upcoming">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{session.title}</p>
                          <Badge variant="secondary">
                            {SESSION_TYPE_LABELS[session.type]}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>
                            {session.date.toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <span>
                            {session.startTime} - {session.endTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {session.attendeeCount}/{session.maxAttendees}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/sessions/${session.id}`}>
                          View
                        </Link>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Session
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Cancel Session
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="past">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {pastSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 opacity-75"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                        <Calendar className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{session.title}</p>
                          <Badge variant="outline">
                            {SESSION_TYPE_LABELS[session.type]}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>
                            {session.date.toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {session.attendeeCount} attended
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

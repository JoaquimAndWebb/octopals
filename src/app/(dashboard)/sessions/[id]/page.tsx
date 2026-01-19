import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  Share2,
  MessageCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { APP_NAME, SESSION_TYPE_LABELS, type SessionType } from "@/lib/constants"

interface SessionPageProps {
  params: Promise<{ id: string }>
}

// Mock data
const mockSession = {
  id: "1",
  title: "Tuesday Training",
  type: "TRAINING" as SessionType,
  description: "Regular weekly training session. We'll focus on stick handling and passing drills in the first hour, followed by scrimmage games. All skill levels welcome!",
  date: new Date(Date.now() + 86400000),
  startTime: "19:00",
  endTime: "21:00",
  location: "Sydney Aquatic Centre",
  address: "Olympic Blvd, Sydney Olympic Park NSW 2127",
  club: {
    id: "1",
    name: "Sydney Stingrays",
    imageUrl: null,
  },
  organizer: {
    id: "1",
    firstName: "Maria",
    lastName: "Santos",
    imageUrl: null,
  },
  attendeeCount: 12,
  maxAttendees: 20,
  rsvpStatus: "YES",
  notes: "Please arrive 15 minutes early for warm-up. Don't forget your snorkel and fins!",
  attendees: [
    { id: "1", firstName: "Alex", lastName: "Chen", rsvpStatus: "YES", imageUrl: null },
    { id: "2", firstName: "Maria", lastName: "Santos", rsvpStatus: "YES", imageUrl: null },
    { id: "3", firstName: "James", lastName: "Wilson", rsvpStatus: "YES", imageUrl: null },
    { id: "4", firstName: "Sarah", lastName: "Lee", rsvpStatus: "YES", imageUrl: null },
    { id: "5", firstName: "Tom", lastName: "Brown", rsvpStatus: "MAYBE", imageUrl: null },
  ],
}

export async function generateMetadata(_props: SessionPageProps): Promise<Metadata> {
  return {
    title: `${mockSession.title} - ${APP_NAME}`,
    description: `${mockSession.title} at ${mockSession.location} on ${mockSession.date.toLocaleDateString()}`,
  }
}

export default async function SessionPage(_props: SessionPageProps) {
  // In production, fetch session data based on id
  if (!mockSession) {
    notFound()
  }

  const session = mockSession

  const goingCount = session.attendees.filter((a) => a.rsvpStatus === "YES").length
  const maybeCount = session.attendees.filter((a) => a.rsvpStatus === "MAYBE").length

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/sessions"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Sessions
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {session.title}
            </h1>
            <Badge variant="secondary">
              {SESSION_TYPE_LABELS[session.type]}
            </Badge>
          </div>
          <div className="mt-2 flex items-center gap-2 text-muted-foreground">
            <Link
              href={`/clubs/${session.club.id}`}
              className="flex items-center gap-2 hover:text-foreground"
            >
              <Avatar className="h-5 w-5">
                <AvatarImage src={session.club.imageUrl || undefined} />
                <AvatarFallback className="text-[10px]">
                  {session.club.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {session.club.name}
            </Link>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <MessageCircle className="mr-2 h-4 w-4" />
            Message
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Session Details */}
          <Card>
            <CardHeader>
              <CardTitle>Session Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {session.date.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">Date</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {session.startTime} - {session.endTime}
                    </p>
                    <p className="text-sm text-muted-foreground">Time</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:col-span-2">
                  <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{session.location}</p>
                    <p className="text-sm text-muted-foreground">{session.address}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="mb-2 font-medium">Description</h3>
                <p className="text-muted-foreground">{session.description}</p>
              </div>

              {session.notes && (
                <>
                  <Separator />
                  <div>
                    <h3 className="mb-2 font-medium">Notes from Organizer</h3>
                    <p className="text-muted-foreground">{session.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Attendees */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Attendees</CardTitle>
                  <CardDescription>
                    {goingCount} going, {maybeCount} maybe
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {session.attendeeCount}/{session.maxAttendees}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {session.attendees.map((attendee) => (
                  <div
                    key={attendee.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={attendee.imageUrl || undefined} />
                        <AvatarFallback>
                          {attendee.firstName.charAt(0)}
                          {attendee.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">
                        {attendee.firstName} {attendee.lastName}
                      </span>
                    </div>
                    <Badge
                      variant={attendee.rsvpStatus === "YES" ? "default" : "secondary"}
                      className={
                        attendee.rsvpStatus === "YES"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }
                    >
                      {attendee.rsvpStatus === "YES" ? "Going" : "Maybe"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* RSVP Card */}
          <Card>
            <CardHeader>
              <CardTitle>Your RSVP</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Current status:</span>
                <Badge
                  className={
                    session.rsvpStatus === "YES"
                      ? "bg-green-100 text-green-700"
                      : session.rsvpStatus === "MAYBE"
                      ? "bg-yellow-100 text-yellow-700"
                      : ""
                  }
                >
                  {session.rsvpStatus === "YES"
                    ? "Going"
                    : session.rsvpStatus === "MAYBE"
                    ? "Maybe"
                    : "Not responded"}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={session.rsvpStatus === "YES" ? "default" : "outline"}
                  className="w-full"
                >
                  Going
                </Button>
                <Button
                  variant={session.rsvpStatus === "MAYBE" ? "default" : "outline"}
                  className="w-full"
                >
                  Maybe
                </Button>
                <Button
                  variant={session.rsvpStatus === "NO" ? "default" : "outline"}
                  className="w-full"
                >
                  Can&apos;t Go
                </Button>
              </div>

              <p className="text-center text-xs text-muted-foreground">
                {session.maxAttendees - session.attendeeCount} spots remaining
              </p>
            </CardContent>
          </Card>

          {/* Organizer */}
          <Card>
            <CardHeader>
              <CardTitle>Organizer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={session.organizer.imageUrl || undefined} />
                  <AvatarFallback>
                    {session.organizer.firstName.charAt(0)}
                    {session.organizer.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {session.organizer.firstName} {session.organizer.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">Session Coordinator</p>
                </div>
              </div>
              <Button variant="outline" className="mt-4 w-full">
                <MessageCircle className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </CardContent>
          </Card>

          {/* Location Map Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                <MapPin className="h-8 w-8 text-muted-foreground" />
              </div>
              <Button variant="outline" className="mt-4 w-full" asChild>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(session.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in Maps
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  Trophy,
  Calendar,
  MapPin,
  ArrowLeft,
  Bell,
  Share2,
  ExternalLink,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { APP_NAME } from "@/lib/constants"

interface CompetitionPageProps {
  params: Promise<{ id: string }>
}

// Mock data
const mockCompetition = {
  id: "1",
  name: "NSW State Championships",
  type: "STATE",
  description: "The annual New South Wales State Championships brings together the best underwater hockey clubs from across the state. This three-day event features multiple divisions including Open, Women, and Masters categories.",
  startDate: new Date("2024-03-15"),
  endDate: new Date("2024-03-17"),
  location: "Sydney Olympic Park Aquatic Centre",
  address: "Olympic Blvd, Sydney Olympic Park NSW 2127",
  city: "Sydney",
  country: "Australia",
  status: "UPCOMING",
  registrationOpen: true,
  registrationDeadline: new Date("2024-03-01"),
  teamCount: 12,
  maxTeams: 16,
  divisions: [
    { name: "Open", teams: 6, maxTeams: 8 },
    { name: "Women", teams: 4, maxTeams: 4 },
    { name: "Masters", teams: 2, maxTeams: 4 },
  ],
  organizer: {
    name: "NSW Underwater Hockey Association",
    email: "info@nswuwh.org.au",
    website: "https://nswuwh.org.au",
  },
  schedule: [
    { day: "Friday", date: "March 15", events: ["Team check-in (4:00 PM)", "Captains meeting (6:00 PM)"] },
    { day: "Saturday", date: "March 16", events: ["Pool games begin (8:00 AM)", "Lunch break (12:00 PM)", "Afternoon games (1:00 PM)"] },
    { day: "Sunday", date: "March 17", events: ["Finals (9:00 AM)", "Award ceremony (3:00 PM)"] },
  ],
  registeredTeams: [
    { name: "Sydney Stingrays", division: "Open" },
    { name: "Melbourne Makos", division: "Open" },
    { name: "Brisbane Barracudas", division: "Open" },
    { name: "Sydney Stingrays Women", division: "Women" },
  ],
  imageUrl: null,
}

export async function generateMetadata(_props: CompetitionPageProps): Promise<Metadata> {
  return {
    title: `${mockCompetition.name} - ${APP_NAME}`,
    description: mockCompetition.description,
  }
}

export default async function CompetitionDetailPage(_props: CompetitionPageProps) {
  // In production, fetch competition data based on id
  if (!mockCompetition) {
    notFound()
  }

  const competition = mockCompetition

  const formatDateRange = (start: Date, end: Date) => {
    const startStr = start.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    })
    const endStr = end.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    return `${startStr} - ${endStr}`
  }

  const daysUntil = Math.ceil(
    (competition.startDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/competitions"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Competitions
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {competition.name}
            </h1>
            <Badge variant="secondary">{competition.type}</Badge>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDateRange(competition.startDate, competition.endDate)}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {competition.city}, {competition.country}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Bell className="mr-2 h-4 w-4" />
            Follow
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Countdown Banner */}
      {daysUntil > 0 && (
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <span className="font-medium">
                {daysUntil} days until competition
              </span>
            </div>
            {competition.registrationOpen && (
              <Button size="sm">Register Now</Button>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          <Tabs defaultValue="about">
            <TabsList>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="teams">Teams</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About This Competition</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{competition.description}</p>

                  <Separator />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">{competition.location}</p>
                      <p className="text-sm text-muted-foreground">{competition.address}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Organizer</p>
                      <p className="font-medium">{competition.organizer.name}</p>
                      <a
                        href={competition.organizer.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        Visit website
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Divisions */}
              <Card>
                <CardHeader>
                  <CardTitle>Divisions</CardTitle>
                  <CardDescription>
                    {competition.teamCount} of {competition.maxTeams} spots filled
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {competition.divisions.map((division) => (
                    <div key={division.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{division.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {division.teams}/{division.maxTeams} teams
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${(division.teams / division.maxTeams) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule">
              <Card>
                <CardHeader>
                  <CardTitle>Event Schedule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {competition.schedule.map((day) => (
                    <div key={day.day}>
                      <h3 className="font-semibold">{day.day}, {day.date}</h3>
                      <ul className="mt-2 space-y-2">
                        {day.events.map((event, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-2 text-muted-foreground"
                          >
                            <Clock className="h-4 w-4" />
                            {event}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="teams">
              <Card>
                <CardHeader>
                  <CardTitle>Registered Teams</CardTitle>
                  <CardDescription>
                    {competition.registeredTeams.length} teams registered
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {competition.registeredTeams.map((team, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <span className="font-medium">{team.name}</span>
                        <Badge variant="outline">{team.division}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="results">
              <Card>
                <CardContent className="py-12 text-center">
                  <Trophy className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Results Coming Soon</h3>
                  <p className="mt-2 text-muted-foreground">
                    Results will be available after the competition ends.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Registration Card */}
          <Card>
            <CardHeader>
              <CardTitle>Registration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {competition.registrationOpen ? (
                <>
                  <div className="flex items-center gap-2 text-green-600">
                    <span className="h-2 w-2 rounded-full bg-green-600" />
                    <span className="font-medium">Registration Open</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Deadline:{" "}
                    {competition.registrationDeadline?.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <Button className="w-full">Register Your Team</Button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-gray-400" />
                    <span className="font-medium">Registration Closed</span>
                  </div>
                  <Button variant="outline" className="w-full" disabled>
                    Registration Closed
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Type</span>
                <Badge variant="outline">{competition.type}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Teams</span>
                <span className="font-medium">
                  {competition.teamCount}/{competition.maxTeams}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Divisions</span>
                <span className="font-medium">{competition.divisions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Duration</span>
                <span className="font-medium">3 days</span>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium">{competition.organizer.name}</p>
              <a
                href={`mailto:${competition.organizer.email}`}
                className="text-sm text-primary hover:underline"
              >
                {competition.organizer.email}
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

import type { Metadata } from "next"
import Link from "next/link"
import { MapPin, Calendar, Trophy, Users, Dumbbell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileHeader } from "@/components/user/profile-header"
import { ProfileBadges } from "@/components/user/profile-badges"
import { APP_NAME, POSITION_LABELS, type SkillLevel, type Position } from "@/lib/constants"

export const metadata: Metadata = {
  title: `My Profile - ${APP_NAME}`,
  description: "View and manage your OctoPals profile",
}

// Mock user data
const mockUser = {
  id: "current-user",
  firstName: "Alex",
  lastName: "Chen",
  fullName: "Alex Chen",
  imageUrl: null,
  coverImageUrl: null,
  bio: "Passionate underwater hockey player with 5 years of experience. Love the strategic depth of the sport and the amazing community. Currently training to improve my breath hold and stick handling.",
  location: "Sydney, Australia",
  skillLevel: "ADVANCED" as SkillLevel,
  primaryPosition: "FORWARD" as Position,
  yearsPlaying: 5,
  joinedDate: new Date("2023-01-15"),
}

const mockStats = {
  clubsJoined: 2,
  sessionsAttended: 48,
  badgesEarned: 3,
  yearsPlaying: 5,
  competitionsEntered: 3,
}

const mockClubs = [
  { id: "1", name: "Sydney Stingrays", role: "Member", joinedDate: new Date("2023-01-15") },
  { id: "2", name: "Blue Mountains UWH", role: "Coach", joinedDate: new Date("2023-06-01") },
]

const mockBadges = [
  { id: "1", name: "First Session", description: "Attended your first training session", category: "ATTENDANCE" as const, earnedAt: new Date("2023-01-20") },
  { id: "2", name: "Regular", description: "Attended 10 sessions", category: "ATTENDANCE" as const, earnedAt: new Date("2023-03-15") },
  { id: "3", name: "Breath Master", description: "Achieved 2-minute breath hold", category: "TRAINING" as const, earnedAt: new Date("2023-08-10") },
]

export default function ProfilePage() {
  const user = mockUser

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="overflow-hidden">
        <ProfileHeader
          user={user}
          stats={{
            clubsJoined: mockStats.clubsJoined,
            sessionsAttended: mockStats.sessionsAttended,
            badgesEarned: mockStats.badgesEarned,
            yearsPlaying: mockStats.yearsPlaying,
          }}
          isOwnProfile={true}
          onEditClick={() => {
            window.location.href = "/profile/edit"
          }}
        />
      </Card>

      {/* Profile Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="clubs">Clubs</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Info */}
            <div className="space-y-6 lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>About Me</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {user.bio || "No bio added yet."}
                  </p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium">{user.location || "Not specified"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Member Since</p>
                        <p className="font-medium">
                          {user.joinedDate.toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Dumbbell className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Experience</p>
                        <p className="font-medium">{user.yearsPlaying} years playing</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Position</p>
                        <p className="font-medium">
                          {user.primaryPosition
                            ? POSITION_LABELS[user.primaryPosition]
                            : "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                      <div>
                        <p className="text-sm">Attended Tuesday Training at Sydney Stingrays</p>
                        <p className="text-xs text-muted-foreground">2 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                      <div>
                        <p className="text-sm">Achieved new breath hold personal best: 2:15</p>
                        <p className="text-xs text-muted-foreground">5 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                      <div>
                        <p className="text-sm">Logged 90 minutes of pool training</p>
                        <p className="text-xs text-muted-foreground">1 week ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Clubs</span>
                    <span className="font-bold">{mockStats.clubsJoined}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Sessions</span>
                    <span className="font-bold">{mockStats.sessionsAttended}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Years Playing</span>
                    <span className="font-bold">{mockStats.yearsPlaying}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Competitions</span>
                    <span className="font-bold">{mockStats.competitionsEntered}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Badges Preview */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Badges</CardTitle>
                  <Badge variant="secondary">{mockBadges.length}</Badge>
                </CardHeader>
                <CardContent>
                  <ProfileBadges badges={mockBadges.slice(0, 3)} />
                  <Button variant="link" asChild className="mt-2 w-full">
                    <Link href="#badges">View All Badges</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="clubs">
          <Card>
            <CardHeader>
              <CardTitle>My Clubs</CardTitle>
              <CardDescription>
                Clubs you&apos;re a member of
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockClubs.map((club) => (
                  <Link
                    key={club.id}
                    href={`/clubs/${club.id}`}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent"
                  >
                    <div>
                      <p className="font-medium">{club.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Joined {club.joinedDate.toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <Badge variant="outline">{club.role}</Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="badges">
          <Card>
            <CardHeader>
              <CardTitle>Badges & Achievements</CardTitle>
              <CardDescription>
                Recognition for your accomplishments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {mockBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="rounded-lg border p-4 text-center"
                  >
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Trophy className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mt-3 font-semibold">{badge.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {badge.description}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Earned {badge.earnedAt.toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity History</CardTitle>
              <CardDescription>Your recent activity on {APP_NAME}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Detailed activity history coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

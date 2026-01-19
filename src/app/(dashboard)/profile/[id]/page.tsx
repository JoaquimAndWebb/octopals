import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MessageCircle, MapPin, Calendar, Trophy, Users, Dumbbell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileHeader } from "@/components/user/profile-header"
import { ProfileBadges } from "@/components/user/profile-badges"
import { APP_NAME, POSITION_LABELS, type SkillLevel, type Position } from "@/lib/constants"

interface UserProfilePageProps {
  params: Promise<{ id: string }>
}

// Mock user data
const mockUser = {
  id: "user1",
  firstName: "Maria",
  lastName: "Santos",
  fullName: "Maria Santos",
  imageUrl: null,
  coverImageUrl: null,
  bio: "Former competitive swimmer turned underwater hockey enthusiast. Coach at Sydney Stingrays. Love helping new players discover the joy of UWH!",
  location: "Sydney, Australia",
  skillLevel: "ELITE" as SkillLevel,
  primaryPosition: "MIDFIELDER" as Position,
  yearsPlaying: 8,
  joinedDate: new Date("2022-03-10"),
}

const mockStats = {
  clubsJoined: 3,
  sessionsAttended: 156,
  badgesEarned: 5,
  yearsPlaying: 8,
}

const mockBadges = [
  { id: "1", name: "Elite Player", description: "Reached Elite skill level", category: "PERFORMANCE" as const, earnedAt: new Date("2023-06-15") },
  { id: "2", name: "Coach", description: "Became a club coach", category: "COMMUNITY" as const, earnedAt: new Date("2023-04-01") },
  { id: "3", name: "100 Sessions", description: "Attended 100 training sessions", category: "ATTENDANCE" as const, earnedAt: new Date("2023-08-20") },
]

export async function generateMetadata(_props: UserProfilePageProps): Promise<Metadata> {
  return {
    title: `${mockUser.fullName} - ${APP_NAME}`,
    description: `View ${mockUser.firstName}'s profile on ${APP_NAME}`,
  }
}

export default async function UserProfilePage(_props: UserProfilePageProps) {
  // In production, fetch user data based on id
  if (!mockUser) {
    notFound()
  }

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
          isOwnProfile={false}
        />

        {/* Action Buttons */}
        <CardContent className="border-t pt-4">
          <div className="flex gap-2">
            <Button asChild>
              <Link href={`/messages?to=${user.id}`}>
                <MessageCircle className="mr-2 h-4 w-4" />
                Send Message
              </Link>
            </Button>
            <Button variant="outline">Follow</Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Info */}
            <div className="space-y-6 lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>About {user.firstName}</CardTitle>
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

              {/* Mutual Clubs */}
              <Card>
                <CardHeader>
                  <CardTitle>Clubs</CardTitle>
                  <CardDescription>
                    Clubs {user.firstName} is a member of
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Link
                      href="/clubs/sydney-stingrays"
                      className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent"
                    >
                      <div>
                        <p className="font-medium">Sydney Stingrays</p>
                        <p className="text-sm text-muted-foreground">Coach</p>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        Mutual
                      </Badge>
                    </Link>
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
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="badges">
          <Card>
            <CardHeader>
              <CardTitle>Badges & Achievements</CardTitle>
              <CardDescription>
                {user.firstName}&apos;s accomplishments
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
      </Tabs>
    </div>
  )
}

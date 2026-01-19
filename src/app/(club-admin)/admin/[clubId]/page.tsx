import type { Metadata } from "next"
import Link from "next/link"
import {
  Users,
  Calendar,
  Package,
  Settings,
  TrendingUp,
  Bell,
  ChevronRight,
  Plus,
  UserPlus,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { APP_NAME } from "@/lib/constants"

interface ClubAdminPageProps {
  params: Promise<{ clubId: string }>
}

// Mock data
const mockClub = {
  id: "1",
  name: "Sydney Stingrays",
  memberCount: 45,
  pendingMemberRequests: 3,
  upcomingSessions: 4,
  equipmentItems: 28,
  recentActivity: [
    { type: "member_join", text: "Sarah Lee joined the club", time: "2 hours ago" },
    { type: "session_created", text: "New session created: Thursday Training", time: "5 hours ago" },
    { type: "equipment", text: "Competition Stick checked out by Tom Brown", time: "1 day ago" },
  ],
}

const mockStats = {
  membersThisMonth: 8,
  sessionsThisMonth: 12,
  avgAttendance: 85,
  equipmentCheckouts: 15,
}

const quickActions = [
  { label: "Add Session", href: "sessions?new=true", icon: Calendar },
  { label: "Invite Members", href: "members?invite=true", icon: UserPlus },
  { label: "Add Equipment", href: "equipment?new=true", icon: Package },
  { label: "Club Settings", href: "settings", icon: Settings },
]

export async function generateMetadata(_props: ClubAdminPageProps): Promise<Metadata> {
  return {
    title: `${mockClub.name} Admin - ${APP_NAME}`,
    description: `Manage ${mockClub.name} on ${APP_NAME}`,
  }
}

export default async function ClubAdminPage({ params }: ClubAdminPageProps) {
  const { clubId } = await params
  const club = mockClub

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {club.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {club.name}
              </h1>
              <p className="text-muted-foreground">Club Admin Dashboard</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/clubs/${clubId}`}>
              View Public Page
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/admin/${clubId}/sessions?new=true`}>
              <Plus className="mr-2 h-4 w-4" />
              New Session
            </Link>
          </Button>
        </div>
      </div>

      {/* Pending Requests Alert */}
      {club.pendingMemberRequests > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <span className="font-medium text-yellow-800">
                {club.pendingMemberRequests} pending member request{club.pendingMemberRequests > 1 ? "s" : ""}
              </span>
            </div>
            <Button asChild size="sm" variant="outline">
              <Link href={`/admin/${clubId}/members?filter=pending`}>
                Review Requests
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Members
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{club.memberCount}</div>
            <p className="text-xs text-muted-foreground">
              +{mockStats.membersThisMonth} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Upcoming Sessions
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{club.upcomingSessions}</div>
            <p className="text-xs text-muted-foreground">
              {mockStats.sessionsThisMonth} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Attendance
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.avgAttendance}%</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Equipment Items
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{club.equipmentItems}</div>
            <p className="text-xs text-muted-foreground">
              {mockStats.equipmentCheckouts} checkouts this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.label}
              href={`/admin/${clubId}/${action.href}`}
              className="flex items-center gap-3 rounded-lg border bg-card p-4 shadow-sm transition-colors hover:bg-accent"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <span className="font-medium">{action.label}</span>
            </Link>
          )
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Admin Navigation */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Manage Club</CardTitle>
              <CardDescription>
                Access different areas of club administration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                href={`/admin/${clubId}/members`}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Member Management</p>
                    <p className="text-sm text-muted-foreground">
                      Manage members, roles, and pending requests
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>

              <Link
                href={`/admin/${clubId}/sessions`}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Session Management</p>
                    <p className="text-sm text-muted-foreground">
                      Create, edit, and manage training sessions
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>

              <Link
                href={`/admin/${clubId}/equipment`}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                    <Package className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Equipment Management</p>
                    <p className="text-sm text-muted-foreground">
                      Track equipment inventory and checkouts
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>

              <Link
                href={`/admin/${clubId}/settings`}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                    <Settings className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">Club Settings</p>
                    <p className="text-sm text-muted-foreground">
                      Update club profile and preferences
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {club.recentActivity.map((activity, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <div>
                      <p className="text-sm">{activity.text}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

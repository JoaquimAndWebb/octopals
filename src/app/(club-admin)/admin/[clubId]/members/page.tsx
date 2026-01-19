"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Search, MoreHorizontal, UserPlus, Mail, Shield, UserX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CLUB_ROLE_LABELS, type ClubRole } from "@/lib/constants"

interface MembersPageProps {
  params: Promise<{ clubId: string }>
}

// Mock data
const mockMembers = [
  { id: "1", firstName: "Alex", lastName: "Chen", email: "alex@example.com", role: "OWNER" as ClubRole, joinedAt: new Date("2023-01-15"), imageUrl: null },
  { id: "2", firstName: "Maria", lastName: "Santos", email: "maria@example.com", role: "COACH" as ClubRole, joinedAt: new Date("2023-02-10"), imageUrl: null },
  { id: "3", firstName: "James", lastName: "Wilson", email: "james@example.com", role: "EQUIPMENT_MANAGER" as ClubRole, joinedAt: new Date("2023-03-05"), imageUrl: null },
  { id: "4", firstName: "Sarah", lastName: "Lee", email: "sarah@example.com", role: "MEMBER" as ClubRole, joinedAt: new Date("2023-06-20"), imageUrl: null },
  { id: "5", firstName: "Tom", lastName: "Brown", email: "tom@example.com", role: "MEMBER" as ClubRole, joinedAt: new Date("2023-08-15"), imageUrl: null },
]

const mockPendingRequests = [
  { id: "p1", firstName: "Emma", lastName: "Johnson", email: "emma@example.com", requestedAt: new Date(Date.now() - 2 * 86400000), message: "I've been playing UWH for 3 years and recently moved to Sydney." },
  { id: "p2", firstName: "Michael", lastName: "Davis", email: "michael@example.com", requestedAt: new Date(Date.now() - 5 * 86400000), message: "Complete beginner but very eager to learn!" },
  { id: "p3", firstName: "Lisa", lastName: "Wang", email: "lisa@example.com", requestedAt: new Date(Date.now() - 7 * 86400000), message: null },
]

export default function MembersPage(_props: MembersPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")

  const filteredMembers = mockMembers.filter((member) => {
    const matchesSearch = `${member.firstName} ${member.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || member.role === roleFilter
    return matchesSearch && matchesRole
  })

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
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Member Management</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your club members and their roles
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Members
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMembers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{mockPendingRequests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Admins & Coaches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockMembers.filter((m) => ["OWNER", "ADMIN", "COACH"].includes(m.role)).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="members" className="space-y-6">
        <TabsList>
          <TabsTrigger value="members">
            Members ({mockMembers.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending Requests ({mockPendingRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="OWNER">Owner</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="COACH">Coach</SelectItem>
                <SelectItem value="MEMBER">Member</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Members List */}
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={member.imageUrl || undefined} />
                        <AvatarFallback>
                          {member.firstName.charAt(0)}
                          {member.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {member.firstName} {member.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {member.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">
                        {CLUB_ROLE_LABELS[member.role]}
                      </Badge>
                      <p className="hidden text-sm text-muted-foreground sm:block">
                        Joined {member.joinedAt.toLocaleDateString()}
                      </p>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Shield className="mr-2 h-4 w-4" />
                            Change Role
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <UserX className="mr-2 h-4 w-4" />
                            Remove from Club
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

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Membership Requests</CardTitle>
              <CardDescription>
                Review and approve new member requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mockPendingRequests.length > 0 ? (
                <div className="space-y-4">
                  {mockPendingRequests.map((request) => (
                    <div
                      key={request.id}
                      className="rounded-lg border p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback>
                              {request.firstName.charAt(0)}
                              {request.lastName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {request.firstName} {request.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {request.email}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Requested {request.requestedAt.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm">Approve</Button>
                          <Button size="sm" variant="outline">Decline</Button>
                        </div>
                      </div>
                      {request.message && (
                        <div className="mt-3 rounded-lg bg-muted p-3">
                          <p className="text-sm text-muted-foreground">
                            &ldquo;{request.message}&rdquo;
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No pending requests
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

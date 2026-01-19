import type { Metadata } from "next"
import Link from "next/link"
import { MapPin, Calendar, Users, Star, Mail, Globe, Phone, Clock, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { APP_NAME, SKILL_LEVEL_LABELS, type SkillLevel } from "@/lib/constants"

interface ClubPageProps {
  params: Promise<{ slug: string }>
}

// Mock club data - in production this would come from an API
const mockClub = {
  id: "1",
  name: "Sydney Stingrays",
  slug: "sydney-stingrays",
  description: "Sydney Stingrays is one of Australia's premier underwater hockey clubs. Founded in 1985, we have a rich history of developing players from complete beginners to national team representatives. Our welcoming community trains three times a week at the Sydney Aquatic Centre.",
  city: "Sydney",
  country: "Australia",
  address: "Sydney Aquatic Centre, Olympic Park, NSW 2127",
  memberCount: 45,
  rating: 4.8,
  reviewCount: 24,
  sessionsPerWeek: 3,
  skillLevels: ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as SkillLevel[],
  imageUrl: null,
  coverImageUrl: null,
  welcomesBeginners: true,
  hasEquipment: true,
  isVerified: true,
  foundedYear: 1985,
  website: "https://sydneystingrays.com",
  email: "info@sydneystingrays.com",
  phone: "+61 2 9999 9999",
  socialLinks: {
    facebook: "https://facebook.com/sydneystingrays",
    instagram: "https://instagram.com/sydneystingrays",
  },
  trainingSchedule: [
    { day: "Tuesday", time: "7:00 PM - 9:00 PM", type: "Mixed Training" },
    { day: "Thursday", time: "7:00 PM - 9:00 PM", type: "Advanced Training" },
    { day: "Saturday", time: "9:00 AM - 11:00 AM", type: "Beginner Session" },
  ],
}

const mockMembers = [
  { id: "1", firstName: "Alex", lastName: "Chen", role: "President", imageUrl: null },
  { id: "2", firstName: "Maria", lastName: "Santos", role: "Coach", imageUrl: null },
  { id: "3", firstName: "James", lastName: "Wilson", role: "Equipment Manager", imageUrl: null },
  { id: "4", firstName: "Sarah", lastName: "Lee", role: "Member", imageUrl: null },
  { id: "5", firstName: "Tom", lastName: "Brown", role: "Member", imageUrl: null },
]

const mockReviews = [
  {
    id: "1",
    author: "John D.",
    rating: 5,
    date: "2024-01-15",
    content: "Amazing club! The coaching is fantastic and everyone is so welcoming. I joined as a complete beginner and after 6 months I'm already playing in scrimmages.",
  },
  {
    id: "2",
    author: "Emma S.",
    rating: 5,
    date: "2024-01-10",
    content: "Best underwater hockey club in Sydney. Great facilities, friendly members, and well-organized sessions.",
  },
  {
    id: "3",
    author: "Mike R.",
    rating: 4,
    date: "2024-01-05",
    content: "Good club with experienced players. Only downside is parking can be tricky during peak times.",
  },
]

export async function generateMetadata(_props: ClubPageProps): Promise<Metadata> {
  // In production, fetch club data based on slug
  return {
    title: `${mockClub.name} - ${APP_NAME}`,
    description: `Join ${mockClub.name} underwater hockey club in ${mockClub.city}, ${mockClub.country}. ${mockClub.sessionsPerWeek} sessions per week. ${mockClub.memberCount} members.`,
  }
}

export default async function ClubPage(_props: ClubPageProps) {
  // In production, fetch club data based on slug
  // For now, we'll use mock data for any slug

  const club = mockClub

  return (
    <div className="flex flex-col pb-16">
      {/* Back Link */}
      <div className="border-b bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/clubs"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Clubs
          </Link>
        </div>
      </div>

      {/* Club Header */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-r from-blue-600 to-blue-800 md:h-64 lg:h-80">
          {club.coverImageUrl && (
            <img
              src={club.coverImageUrl}
              alt={`${club.name} cover`}
              className="h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        </div>

        {/* Club Info */}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="-mt-16 flex flex-col gap-4 sm:-mt-20 sm:flex-row sm:items-end sm:gap-6">
            {/* Avatar */}
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg sm:h-32 sm:w-32">
              <AvatarImage src={club.imageUrl || undefined} alt={club.name} />
              <AvatarFallback className="bg-blue-600 text-2xl font-bold text-white sm:text-3xl">
                {club.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            {/* Name and Info */}
            <div className="flex-1 pb-4">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold sm:text-3xl">{club.name}</h1>
                {club.isVerified && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    Verified
                  </Badge>
                )}
              </div>
              <div className="mt-1 flex items-center gap-1 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>
                  {club.city}, {club.country}
                </span>
              </div>

              {/* Quick Stats */}
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{club.memberCount}</span>
                  <span className="text-gray-500">members</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{club.rating.toFixed(1)}</span>
                  <span className="text-gray-500">({club.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{club.sessionsPerWeek}</span>
                  <span className="text-gray-500">sessions/week</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pb-4">
              <Button asChild>
                <Link href="/sign-up">Join Club</Link>
              </Button>
              <Button variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                Contact
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Content */}
      <div className="mx-auto mt-8 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue="about">
          <TabsList className="mb-8">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-8">
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Main Content */}
              <div className="space-y-8 lg:col-span-2">
                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle>About {club.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{club.description}</p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {club.skillLevels.map((level) => (
                        <Badge key={level} variant="outline">
                          {SKILL_LEVEL_LABELS[level]}
                        </Badge>
                      ))}
                      {club.welcomesBeginners && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          Beginner Friendly
                        </Badge>
                      )}
                      {club.hasEquipment && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          Equipment Available
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Training Schedule */}
                <Card>
                  <CardHeader>
                    <CardTitle>Training Schedule</CardTitle>
                    <CardDescription>Regular weekly training sessions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {club.trainingSchedule.map((session, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-lg border p-4"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                              <Clock className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">{session.day}</p>
                              <p className="text-sm text-gray-500">{session.time}</p>
                            </div>
                          </div>
                          <Badge variant="outline">{session.type}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Contact Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-5 w-5 text-gray-500" />
                      <span className="text-sm text-gray-600">{club.address}</span>
                    </div>
                    {club.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-gray-500" />
                        <a
                          href={`mailto:${club.email}`}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {club.email}
                        </a>
                      </div>
                    )}
                    {club.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-gray-500" />
                        <a
                          href={`tel:${club.phone}`}
                          className="text-sm text-gray-600 hover:underline"
                        >
                          {club.phone}
                        </a>
                      </div>
                    )}
                    {club.website && (
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-gray-500" />
                        <a
                          href={club.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Facts */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Facts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Founded</span>
                      <span className="font-medium">{club.foundedYear}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Members</span>
                      <span className="font-medium">{club.memberCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Sessions/Week</span>
                      <span className="font-medium">{club.sessionsPerWeek}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Rating</span>
                      <span className="flex items-center gap-1 font-medium">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {club.rating.toFixed(1)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sessions">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Sessions</CardTitle>
                <CardDescription>
                  Sign up to see session details and RSVP
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-12 text-center">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium">View Sessions</h3>
                  <p className="mt-2 text-gray-500">
                    Sign in or join the club to view upcoming sessions and RSVP.
                  </p>
                  <Button asChild className="mt-6">
                    <Link href="/sign-up">Sign Up to View</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members">
            <Card>
              <CardHeader>
                <CardTitle>Club Members</CardTitle>
                <CardDescription>
                  {club.memberCount} members in this club
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {mockMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 rounded-lg border p-4"
                    >
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
                        <p className="text-sm text-gray-500">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-center text-sm text-gray-500">
                  Sign in to see more members and connect with them.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Reviews</CardTitle>
                      <CardDescription>
                        {club.reviewCount} reviews from club members
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-2xl font-bold">
                        <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                        {club.rating.toFixed(1)}
                      </div>
                      <p className="text-sm text-gray-500">out of 5</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="border-b pb-6 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.author}</span>
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "fill-gray-200 text-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <p className="mt-2 text-gray-600">{review.content}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

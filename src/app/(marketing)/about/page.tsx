import type { Metadata } from "next"
import Link from "next/link"
import { Target, Eye, Heart, Users, Globe, Zap, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { APP_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: `About - ${APP_NAME}`,
  description: "Learn about OctoPals - our mission to connect the global underwater hockey community and grow the sport.",
}

const values = [
  {
    icon: Heart,
    title: "Passion for the Sport",
    description: "We're players ourselves, and we understand what the community needs to thrive.",
  },
  {
    icon: Users,
    title: "Community First",
    description: "Every feature we build is designed to strengthen connections between players and clubs.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Underwater hockey is played worldwide, and our platform connects players across borders.",
  },
  {
    icon: Zap,
    title: "Continuous Improvement",
    description: "Just like in training, we're always working to get better and deliver more value.",
  },
]

const team = [
  {
    name: "Alex Chen",
    role: "Founder & CEO",
    bio: "Former national team player with 15 years of UWH experience. Built OctoPals to solve problems he faced as both a player and club organizer.",
    imageUrl: "/team/alex.jpg",
  },
  {
    name: "Maria Santos",
    role: "Head of Product",
    bio: "Product leader passionate about community platforms. Active player in the Sydney underwater hockey scene.",
    imageUrl: "/team/maria.jpg",
  },
  {
    name: "James Wilson",
    role: "Lead Engineer",
    bio: "Full-stack developer and recreational diver. Loves building tools that bring communities together.",
    imageUrl: "/team/james.jpg",
  },
]

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              About {APP_NAME}
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              We&apos;re on a mission to connect the global underwater hockey community
              and help grow this amazing sport. Built by players, for players.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2">
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="mt-4 text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-700">
                  To empower underwater hockey players and clubs with the tools they need
                  to organize, train, and grow together. We believe that by making it easier
                  to find clubs, join sessions, and track progress, we can help more people
                  discover and fall in love with this incredible sport.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-600">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="mt-4 text-2xl">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-700">
                  A world where anyone curious about underwater hockey can easily find
                  a welcoming club, where every player can track their journey and celebrate
                  their progress, and where the global UWH community is more connected than ever.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-gray-50 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our Story
            </h2>
            <div className="mt-8 space-y-6 text-lg text-gray-600">
              <p>
                {APP_NAME} was born out of frustration. As underwater hockey players ourselves,
                we found it surprisingly difficult to find training sessions when traveling,
                discover new clubs, or even coordinate with our own teams.
              </p>
              <p>
                Club information was scattered across Facebook groups, outdated websites,
                and WhatsApp chains. Training logs were kept in notebooks that got lost.
                And connecting with the broader UWH community? That required knowing someone
                who knew someone.
              </p>
              <p>
                We knew there had to be a better way. So in 2023, we started building {APP_NAME} -
                a platform designed specifically for the underwater hockey community. Not another
                generic sports app, but something built with deep understanding of what UWH
                players and clubs actually need.
              </p>
              <p>
                Today, {APP_NAME} serves clubs and players in over 50 countries. But we&apos;re
                just getting started. With every feature we add and every club that joins,
                we&apos;re one step closer to our vision of a truly connected global UWH community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our Values
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              These principles guide everything we do at {APP_NAME}.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon
              return (
                <div key={value.title} className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
                    <Icon className="h-7 w-7 text-blue-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-gray-600">
                    {value.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gray-50 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Meet the Team
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              The passionate people behind {APP_NAME}.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <Card key={member.name} className="text-center">
                <CardHeader>
                  <div className="mx-auto h-24 w-24 overflow-hidden rounded-full bg-gray-200">
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 text-3xl font-bold text-white">
                      {member.name.charAt(0)}
                    </div>
                  </div>
                  <CardTitle className="mt-4">{member.name}</CardTitle>
                  <CardDescription className="text-blue-600">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-blue-600 px-8 py-16 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to Join the Community?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-blue-100">
              Whether you&apos;re a beginner looking to try underwater hockey or an experienced
              player seeking new connections, {APP_NAME} is here for you.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                <Link href="/sign-up">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                <Link href="/clubs">
                  Explore Clubs
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

import type { Metadata } from "next"
import Link from "next/link"
import { MapPin, Calendar, TrendingUp, Users, Dumbbell, Trophy, ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants"

export const metadata: Metadata = {
  title: `${APP_NAME} - Connect with the Global Underwater Hockey Community`,
  description: APP_DESCRIPTION,
}

const features = [
  {
    icon: MapPin,
    title: "Club Finder",
    description: "Discover underwater hockey clubs near you with our interactive map and detailed club profiles.",
  },
  {
    icon: Calendar,
    title: "Session Management",
    description: "View upcoming training sessions, RSVP, and never miss a practice with smart reminders.",
  },
  {
    icon: TrendingUp,
    title: "Training Analytics",
    description: "Track your breath hold times, log training sessions, and monitor your improvement over time.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Connect with players, share experiences, and grow the sport together.",
  },
  {
    icon: Dumbbell,
    title: "Equipment Library",
    description: "Browse and borrow club equipment, track gear availability, and manage your own kit.",
  },
  {
    icon: Trophy,
    title: "Competitions",
    description: "Stay updated on upcoming tournaments, register your team, and follow results.",
  },
]

const howItWorks = [
  {
    step: 1,
    title: "Create Your Profile",
    description: "Sign up and tell us about your experience level and preferred positions.",
  },
  {
    step: 2,
    title: "Find Your Club",
    description: "Search for clubs in your area and join the ones that match your schedule.",
  },
  {
    step: 3,
    title: "Start Training",
    description: "RSVP to sessions, track your progress, and become part of the community.",
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 py-20 text-white md:py-32">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Connect with the Global{" "}
              <span className="text-blue-200">Underwater Hockey</span>{" "}
              Community
            </h1>
            <p className="mt-6 text-lg text-blue-100 md:text-xl">
              Find clubs, join training sessions, track your progress, and connect with players worldwide.
              The ultimate platform for the underwater hockey community.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                <Link href="/sign-up">
                  Get Started Free
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

      {/* Features Grid */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything You Need to Dive Deeper
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              {APP_NAME} provides all the tools you need to find clubs, manage sessions, and improve your game.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} className="border-gray-200 transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="mt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Get started in minutes and join the underwater hockey community.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {howItWorks.map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Ready to Dive In?
              </h2>
              <p className="mt-3 text-lg text-blue-100">
                Join thousands of players already using {APP_NAME}.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                <Link href="/sign-up">
                  Create Free Account
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                <Link href="/pricing">
                  View Pricing
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-center text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>500+ Clubs Worldwide</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>10,000+ Active Players</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>50+ Countries</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Free to Get Started</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

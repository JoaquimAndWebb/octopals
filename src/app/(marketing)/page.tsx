import type { Metadata } from "next"
import Link from "next/link"
import { MapPin, Calendar, TrendingUp, Users, Dumbbell, Trophy, ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants"
import {
  AnimatedWaves,
  FloatingBubbles,
  AnimatedHeroContent,
  AnimatedTitle,
  AnimatedDescription,
  AnimatedButtons,
  FadeInSection,
  StaggerContainer,
  StaggerItem,
  AnimatedStat,
  AnimatedStep,
  PulsingStepNumber,
} from "@/components/landing/animated-sections"

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

        {/* Floating bubbles for underwater effect */}
        <FloatingBubbles />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedHeroContent>
            <AnimatedTitle>
              Connect with the Global{" "}
              <span className="text-blue-200">Underwater Hockey</span>{" "}
              Community
            </AnimatedTitle>
            <AnimatedDescription>
              Find clubs, join training sessions, track your progress, and connect with players worldwide.
              The ultimate platform for the underwater hockey community.
            </AnimatedDescription>
            <AnimatedButtons>
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
            </AnimatedButtons>
          </AnimatedHeroContent>
        </div>

        {/* Animated waves at the bottom */}
        <AnimatedWaves />
      </section>

      {/* Features Grid */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInSection className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything You Need to Dive Deeper
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              {APP_NAME} provides all the tools you need to find clubs, manage sessions, and improve your game.
            </p>
          </FadeInSection>

          <StaggerContainer className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <StaggerItem key={feature.title}>
                  <Card className="border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
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
                </StaggerItem>
              )
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInSection className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Get started in minutes and join the underwater hockey community.
            </p>
          </FadeInSection>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {howItWorks.map((item) => (
              <AnimatedStep key={item.step} step={item.step}>
                <PulsingStepNumber step={item.step} />
                <h3 className="mt-6 text-xl font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-gray-600">
                  {item.description}
                </p>
              </AnimatedStep>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-blue-600 py-16 md:py-20">
        {/* Subtle wave at top */}
        <div className="absolute top-0 left-0 right-0 rotate-180">
          <svg
            className="relative block w-full h-[40px]"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,60 C200,90 400,30 600,60 C800,90 1000,30 1200,60 L1200,120 L0,120 Z"
              fill="rgba(255,255,255,0.05)"
            />
          </svg>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInSection>
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
          </FadeInSection>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-center text-gray-600">
            <AnimatedStat>
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>500+ Clubs Worldwide</span>
            </AnimatedStat>
            <AnimatedStat>
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>10,000+ Active Players</span>
            </AnimatedStat>
            <AnimatedStat>
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>50+ Countries</span>
            </AnimatedStat>
            <AnimatedStat>
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Free to Get Started</span>
            </AnimatedStat>
          </div>
        </div>
      </section>
    </div>
  )
}

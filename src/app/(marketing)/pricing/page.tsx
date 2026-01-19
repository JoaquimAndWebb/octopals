import type { Metadata } from "next"
import Link from "next/link"
import { Check, X, HelpCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { APP_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: `Pricing - ${APP_NAME}`,
  description: "Choose the right plan for you or your club. Free tier available for all players.",
}

interface PricingFeature {
  name: string
  included: boolean
  tooltip?: string
}

interface PricingTier {
  name: string
  description: string
  price: string
  priceNote?: string
  popular?: boolean
  buttonText: string
  buttonVariant: "default" | "outline"
  features: PricingFeature[]
  audience: string
}

const playerTiers: PricingTier[] = [
  {
    name: "Free",
    description: "Everything you need to get started",
    price: "$0",
    priceNote: "forever",
    buttonText: "Get Started",
    buttonVariant: "outline",
    audience: "For casual players",
    features: [
      { name: "Join unlimited clubs", included: true },
      { name: "RSVP to sessions", included: true },
      { name: "View club schedules", included: true },
      { name: "Basic profile", included: true },
      { name: "Message other players", included: true },
      { name: "Breath hold timer", included: true },
      { name: "Training log (last 30 days)", included: true, tooltip: "View your training history from the last 30 days" },
      { name: "Progress analytics", included: false },
      { name: "Export training data", included: false },
      { name: "Priority support", included: false },
    ],
  },
  {
    name: "Player Pro",
    description: "For serious players who want to track everything",
    price: "$5",
    priceNote: "per month",
    popular: true,
    buttonText: "Start Free Trial",
    buttonVariant: "default",
    audience: "For dedicated players",
    features: [
      { name: "Everything in Free", included: true },
      { name: "Unlimited training history", included: true },
      { name: "Advanced progress analytics", included: true, tooltip: "Charts, trends, and insights into your performance" },
      { name: "Export training data (CSV/PDF)", included: true },
      { name: "Custom training programs", included: true },
      { name: "Competition tracking", included: true },
      { name: "Personal best records", included: true },
      { name: "Priority support", included: true },
      { name: "Early access to new features", included: true },
      { name: "No ads", included: true },
    ],
  },
]

const clubTiers: PricingTier[] = [
  {
    name: "Club Starter",
    description: "For small clubs just getting organized",
    price: "$15",
    priceNote: "per month",
    buttonText: "Start Free Trial",
    buttonVariant: "outline",
    audience: "Up to 25 members",
    features: [
      { name: "Up to 25 members", included: true },
      { name: "Session management", included: true },
      { name: "Basic equipment tracking", included: true, tooltip: "Track up to 50 equipment items" },
      { name: "Member directory", included: true },
      { name: "Club announcements", included: true },
      { name: "Public club profile", included: true },
      { name: "Email support", included: true },
      { name: "Advanced analytics", included: false },
      { name: "Custom branding", included: false },
      { name: "API access", included: false },
    ],
  },
  {
    name: "Club Pro",
    description: "For growing clubs with active programs",
    price: "$35",
    priceNote: "per month",
    popular: true,
    buttonText: "Start Free Trial",
    buttonVariant: "default",
    audience: "Up to 100 members",
    features: [
      { name: "Up to 100 members", included: true },
      { name: "Everything in Starter", included: true },
      { name: "Unlimited equipment tracking", included: true },
      { name: "Multiple session types", included: true },
      { name: "Attendance analytics", included: true },
      { name: "Equipment checkout system", included: true },
      { name: "Member skill tracking", included: true },
      { name: "Priority support", included: true },
      { name: "Custom branding", included: false },
      { name: "API access", included: false },
    ],
  },
  {
    name: "Club Elite",
    description: "For large clubs and organizations",
    price: "$75",
    priceNote: "per month",
    buttonText: "Contact Sales",
    buttonVariant: "outline",
    audience: "Unlimited members",
    features: [
      { name: "Unlimited members", included: true },
      { name: "Everything in Pro", included: true },
      { name: "Custom branding", included: true, tooltip: "Your logo and colors throughout the app" },
      { name: "Advanced reporting", included: true },
      { name: "API access", included: true },
      { name: "Multiple admin roles", included: true },
      { name: "Dedicated account manager", included: true },
      { name: "Custom integrations", included: true },
      { name: "SLA guarantee", included: true },
      { name: "Training & onboarding", included: true },
    ],
  },
]

function PricingCard({ tier }: { tier: PricingTier }) {
  return (
    <Card className={`relative flex flex-col ${tier.popular ? "border-blue-600 shadow-lg" : ""}`}>
      {tier.popular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600">
          Most Popular
        </Badge>
      )}
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{tier.name}</CardTitle>
        <CardDescription>{tier.description}</CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold">{tier.price}</span>
          {tier.priceNote && (
            <span className="text-gray-500">/{tier.priceNote}</span>
          )}
        </div>
        <p className="mt-2 text-sm text-gray-500">{tier.audience}</p>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-3">
          <TooltipProvider>
            {tier.features.map((feature) => (
              <li key={feature.name} className="flex items-start gap-3">
                {feature.included ? (
                  <Check className="h-5 w-5 shrink-0 text-green-500" />
                ) : (
                  <X className="h-5 w-5 shrink-0 text-gray-300" />
                )}
                <span className={feature.included ? "text-gray-700" : "text-gray-400"}>
                  {feature.name}
                </span>
                {feature.tooltip && (
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{feature.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </li>
            ))}
          </TooltipProvider>
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          asChild
          className="w-full"
          variant={tier.buttonVariant}
          size="lg"
        >
          <Link href="/sign-up">
            {tier.buttonText}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function PricingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Simple, Transparent Pricing
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Choose the plan that works for you. All plans include a 14-day free trial.
              No credit card required to get started.
            </p>
          </div>
        </div>
      </section>

      {/* Player Tiers */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              For Players
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Track your training, connect with clubs, and improve your game.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-4xl gap-8 lg:grid-cols-2">
            {playerTiers.map((tier) => (
              <PricingCard key={tier.name} tier={tier} />
            ))}
          </div>
        </div>
      </section>

      {/* Club Tiers */}
      <section className="bg-gray-50 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              For Clubs
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Manage your club, organize sessions, and grow your membership.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-6xl gap-8 lg:grid-cols-3">
            {clubTiers.map((tier) => (
              <PricingCard key={tier.name} tier={tier} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 text-center sm:text-4xl">
            Frequently Asked Questions
          </h2>

          <div className="mt-12 space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Can I try {APP_NAME} before paying?
              </h3>
              <p className="mt-2 text-gray-600">
                Absolutely! The Free tier gives you access to core features forever.
                Pro tiers include a 14-day free trial with no credit card required.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Can I change plans later?
              </h3>
              <p className="mt-2 text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. If you upgrade,
                you&apos;ll be charged the prorated difference. If you downgrade,
                your new rate takes effect at the next billing cycle.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                What payment methods do you accept?
              </h3>
              <p className="mt-2 text-gray-600">
                We accept all major credit cards (Visa, Mastercard, American Express)
                and PayPal. For Club Elite plans, we also offer invoicing.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Is there a discount for annual billing?
              </h3>
              <p className="mt-2 text-gray-600">
                Yes! When you choose annual billing, you get 2 months free
                (equivalent to about 17% off).
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                What happens to my data if I cancel?
              </h3>
              <p className="mt-2 text-gray-600">
                You can export your data at any time. After cancellation,
                your data is retained for 30 days, then permanently deleted.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Still have questions?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-blue-100">
            Our team is here to help. Reach out and we&apos;ll get back to you within 24 hours.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              <Link href="/contact">
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs"
import {
  Menu,
  X,
  Trophy,
  Users,
  Dumbbell,
  LogIn,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { APP_NAME } from "@/lib/constants"

interface NavLink {
  href: string
  label: string
  icon: React.ReactNode
  requiresAuth?: boolean
}

const navLinks: NavLink[] = [
  {
    href: "/clubs",
    label: "Clubs",
    icon: <Users className="h-4 w-4" />,
    requiresAuth: true,
  },
  {
    href: "/competitions",
    label: "Competitions",
    icon: <Trophy className="h-4 w-4" />,
    requiresAuth: true,
  },
  {
    href: "/training",
    label: "Training",
    icon: <Dumbbell className="h-4 w-4" />,
    requiresAuth: true,
  },
]

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            <span className="text-lg font-bold">O</span>
          </div>
          <span className="text-xl font-bold text-gray-900">{APP_NAME}</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-6">
          <SignedIn>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </SignedIn>
        </div>

        {/* User Menu / Auth */}
        <div className="flex items-center gap-4">
          <SignedIn>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9",
                },
              }}
            />
          </SignedIn>

          <SignedOut>
            <Link
              href="/sign-in"
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </Link>
          </SignedOut>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 md:hidden"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <div className="space-y-1 px-4 py-4">
            <SignedIn>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium transition-colors",
                    isActive(link.href)
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </SignedIn>

            <SignedOut>
              <Link
                href="/sign-in"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <LogIn className="h-5 w-5" />
                Sign In
              </Link>
              <Link
                href="/sign-up"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-md bg-blue-600 px-3 py-2 text-base font-medium text-white hover:bg-blue-700"
              >
                Get Started
              </Link>
            </SignedOut>
          </div>
        </div>
      )}
    </header>
  )
}

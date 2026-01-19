"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Users,
  Calendar,
  Dumbbell,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Home",
    icon: Home,
  },
  {
    href: "/clubs",
    label: "Clubs",
    icon: Users,
  },
  {
    href: "/sessions",
    label: "Sessions",
    icon: Calendar,
  },
  {
    href: "/training",
    label: "Training",
    icon: Dumbbell,
  },
  {
    href: "/profile",
    label: "Profile",
    icon: User,
  },
]

export function MobileNav() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white md:hidden">
      <div className="grid h-16 grid-cols-5">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
                active
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-900"
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    "h-5 w-5",
                    active && "text-blue-600"
                  )}
                />
                {active && (
                  <span className="absolute -top-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-blue-600" />
                )}
              </div>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
      {/* Safe area padding for devices with home indicators */}
      <div className="h-safe-area-inset-bottom bg-white" />
    </nav>
  )
}

import Link from "next/link"
import { Home, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 px-4">
      <div className="mx-auto max-w-md text-center">
        {/* 404 Illustration */}
        <div className="relative mx-auto h-48 w-48">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-8xl font-bold text-blue-100">404</span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-4xl">🐙</span>
            </div>
          </div>
        </div>

        <h1 className="mt-8 text-3xl font-bold text-gray-900">
          Page Not Found
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Oops! Looks like this page got lost in the deep end.
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/clubs">
              <Search className="mr-2 h-4 w-4" />
              Find Clubs
            </Link>
          </Button>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help? Visit our{" "}
            <Link href="/help" className="text-blue-600 hover:underline">
              Help Center
            </Link>
            {" "}or{" "}
            <Link href="/contact" className="text-blue-600 hover:underline">
              contact support
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

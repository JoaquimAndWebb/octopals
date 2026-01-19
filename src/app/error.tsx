"use client"

import { useEffect } from "react"
import Link from "next/link"
import { RefreshCw, Home, AlertTriangle, Bug } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-red-50 px-4">
      <div className="mx-auto max-w-md text-center">
        {/* Error Illustration */}
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-12 w-12 text-red-600" />
        </div>

        <h1 className="mt-8 text-3xl font-bold text-gray-900">
          Something Went Wrong
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          We apologize for the inconvenience. An unexpected error occurred while
          processing your request.
        </p>

        {/* Error Details (in development) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-6 rounded-lg bg-gray-100 p-4 text-left">
            <p className="text-sm font-mono text-gray-700 break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="mt-2 text-xs text-gray-500">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={() => reset()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button asChild variant="outline">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            If this problem persists, please{" "}
            <Link href="/contact" className="text-blue-600 hover:underline">
              contact our support team
            </Link>
            {" "}with the following error ID:
          </p>
          {error.digest && (
            <code className="mt-2 inline-block rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
              {error.digest}
            </code>
          )}
        </div>

        {/* Report Bug Link */}
        <div className="mt-6">
          <Button asChild variant="ghost" size="sm" className="text-gray-500">
            <Link href="/contact?type=bug">
              <Bug className="mr-2 h-4 w-4" />
              Report this issue
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

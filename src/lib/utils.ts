import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday } from "date-fns"

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date as a human-readable string
 * @param date - Date to format
 * @param formatStr - Optional format string (default: "MMM d, yyyy")
 */
export function formatDate(date: Date | string, formatStr: string = "MMM d, yyyy"): string {
  const d = typeof date === "string" ? new Date(date) : date
  return format(d, formatStr)
}

/**
 * Format a time as a human-readable string
 * @param date - Date to format
 * @param formatStr - Optional format string (default: "h:mm a")
 */
export function formatTime(date: Date | string, formatStr: string = "h:mm a"): string {
  const d = typeof date === "string" ? new Date(date) : date
  return format(d, formatStr)
}

/**
 * Format a date and time as a human-readable string
 * @param date - Date to format
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return format(d, "MMM d, yyyy 'at' h:mm a")
}

/**
 * Format a date relative to now (e.g., "2 days ago", "in 3 hours")
 * @param date - Date to format
 */
export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return formatDistanceToNow(d, { addSuffix: true })
}

/**
 * Format a date for display with smart relative dates
 * Shows "Today", "Tomorrow", "Yesterday", or the full date
 */
export function formatSmartDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date

  if (isToday(d)) {
    return `Today at ${formatTime(d)}`
  }
  if (isTomorrow(d)) {
    return `Tomorrow at ${formatTime(d)}`
  }
  if (isYesterday(d)) {
    return `Yesterday at ${formatTime(d)}`
  }

  return formatDateTime(d)
}

/**
 * Format a distance in kilometers for display
 * @param distanceKm - Distance in kilometers
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000)
    return `${meters} m away`
  }
  if (distanceKm < 10) {
    return `${distanceKm.toFixed(1)} km away`
  }
  return `${Math.round(distanceKm)} km away`
}

/**
 * Get initials from a name (for avatars)
 * @param firstName - First name
 * @param lastName - Last name (optional)
 */
export function getInitials(firstName?: string | null, lastName?: string | null): string {
  const first = firstName?.trim().charAt(0).toUpperCase() || ""
  const last = lastName?.trim().charAt(0).toUpperCase() || ""

  if (first && last) {
    return `${first}${last}`
  }
  if (first) {
    return first
  }
  return "?"
}

/**
 * Get initials from a full name
 * @param fullName - Full name string
 */
export function getInitialsFromFullName(fullName?: string | null): string {
  if (!fullName) return "?"

  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase()
  }

  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase()
}

/**
 * Create a URL-friendly slug from a string
 * @param str - String to slugify
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/**
 * Truncate a string to a maximum length
 * @param str - String to truncate
 * @param maxLength - Maximum length
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return `${str.slice(0, maxLength - 3)}...`
}

/**
 * Format a number as a compact string (e.g., 1.2k, 3.5M)
 */
export function formatCompactNumber(num: number): string {
  if (num < 1000) return num.toString()
  if (num < 1000000) return `${(num / 1000).toFixed(1)}k`
  return `${(num / 1000000).toFixed(1)}M`
}

/**
 * Format duration in minutes to a readable string
 * @param minutes - Duration in minutes
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (mins === 0) {
    return `${hours}h`
  }
  return `${hours}h ${mins}m`
}

/**
 * Format seconds to a readable time string (MM:SS or HH:MM:SS)
 * @param seconds - Duration in seconds
 */
export function formatSeconds(seconds: number): string {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

/**
 * Capitalize the first letter of a string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Convert an enum-style string to a readable format
 * e.g., "BEGINNER_INTRO" -> "Beginner Intro"
 */
export function formatEnumValue(value: string): string {
  return value
    .split("_")
    .map((word) => capitalize(word))
    .join(" ")
}

/**
 * Generate a random string of specified length
 */
export function randomString(length: number = 8): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Check if a value is empty (null, undefined, empty string, or empty array)
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === "string" && value.trim() === "") return true
  if (Array.isArray(value) && value.length === 0) return true
  return false
}

/**
 * Debounce a function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return function (this: unknown, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}

/**
 * Sleep for a specified duration
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

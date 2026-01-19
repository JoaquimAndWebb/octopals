import useSWR from 'swr'
import { fetcher } from '@/lib/fetcher'

// Types
interface User {
  id: string
  clerkId: string
  email: string
  username: string | null
  firstName: string | null
  lastName: string | null
  imageUrl: string | null
  bio: string | null
  location: string | null
  country: string | null
  latitude: number | null
  longitude: number | null
  yearsPlaying: number | null
  primaryPosition: string | null
  skillLevel: string
  isPublicProfile: boolean
  emailNotifications: boolean
  pushNotifications: boolean
  subscriptionTier: string
  createdAt: string
  updatedAt: string
}

interface UserStats {
  sessionsAttended: number
  sessionsRsvpd: number
  clubsJoined: number
  trainingLogs: number
  breathHoldPb: number | null // in seconds
  badgesEarned: number
  reviewsWritten: number
  memberSince: string
}

interface UserClub {
  id: string
  clubId: string
  role: string
  joinedAt: string
  club: {
    id: string
    name: string
    slug: string
    imageUrl: string | null
    city: string
    country: string
  }
}

interface UserBadge {
  id: string
  earnedAt: string
  badge: {
    id: string
    name: string
    description: string
    imageUrl: string | null
    category: string
  }
}

/**
 * Fetch current authenticated user
 */
export function useCurrentUser() {
  return useSWR<User>('/api/users/me', fetcher)
}

/**
 * Fetch a user's public profile by ID
 */
export function useUserProfile(userId: string | null) {
  return useSWR<User>(userId ? `/api/users/${userId}` : null, fetcher)
}

/**
 * Fetch current user's statistics
 */
export function useUserStats(userId?: string) {
  const url = userId ? `/api/users/${userId}/stats` : '/api/users/me/stats'
  return useSWR<UserStats>(url, fetcher)
}

/**
 * Fetch current user's clubs
 */
export function useUserClubs() {
  return useSWR<UserClub[]>('/api/users/me/clubs', fetcher)
}

/**
 * Fetch a specific user's clubs (public)
 */
export function useUserPublicClubs(userId: string | null) {
  return useSWR<UserClub[]>(userId ? `/api/users/${userId}/clubs` : null, fetcher)
}

/**
 * Fetch current user's badges
 */
export function useUserBadges(userId?: string) {
  const url = userId ? `/api/users/${userId}/badges` : '/api/users/me/badges'
  return useSWR<UserBadge[]>(url, fetcher)
}

/**
 * Fetch current user's favorite clubs
 */
export function useFavoriteClubs() {
  return useSWR<UserClub[]>('/api/favorites/clubs', fetcher)
}

/**
 * Check if a club is favorited
 */
export function useIsFavorite(clubId: string | null) {
  return useSWR<{ isFavorite: boolean }>(
    clubId ? `/api/favorites/clubs/${clubId}` : null,
    fetcher
  )
}

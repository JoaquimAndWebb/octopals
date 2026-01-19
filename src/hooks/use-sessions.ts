import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'
import { fetcher } from '@/lib/fetcher'

// Types
interface Session {
  id: string
  clubId: string
  venueId: string | null
  title: string
  description: string | null
  type: string
  skillLevel: string | null
  startTime: string
  endTime: string
  maxAttendees: number | null
  isCancelled: boolean
  cancelReason: string | null
  isRecurring: boolean
  recurringRule: string | null
  createdById: string
  createdAt: string
  updatedAt: string
  club?: {
    id: string
    name: string
    slug: string
    imageUrl: string | null
  }
  venue?: {
    id: string
    name: string
    address: string
    city: string
  }
  _count?: {
    rsvps: number
    attendances: number
  }
}

interface SessionRsvp {
  id: string
  sessionId: string
  userId: string
  status: 'YES' | 'NO' | 'MAYBE'
  note: string | null
  createdAt: string
  updatedAt: string
  session?: Session
  user?: {
    id: string
    firstName: string | null
    lastName: string | null
    imageUrl: string | null
  }
}

interface SessionFilters {
  clubId?: string
  type?: string
  skillLevel?: string
  startDate?: string
  endDate?: string
  includesCancelled?: boolean
}

interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

const PAGE_SIZE = 20

/**
 * Fetch list of sessions with optional filters
 */
export function useSessions(filters?: SessionFilters) {
  const params = new URLSearchParams()
  if (filters?.clubId) params.append('clubId', filters.clubId)
  if (filters?.type) params.append('type', filters.type)
  if (filters?.skillLevel) params.append('skillLevel', filters.skillLevel)
  if (filters?.startDate) params.append('startDate', filters.startDate)
  if (filters?.endDate) params.append('endDate', filters.endDate)
  if (filters?.includesCancelled !== undefined)
    params.append('includesCancelled', String(filters.includesCancelled))

  const queryString = params.toString()
  const url = `/api/sessions${queryString ? `?${queryString}` : ''}`

  return useSWR<PaginatedResponse<Session>>(url, fetcher)
}

/**
 * Fetch sessions with infinite scroll pagination
 */
export function useInfiniteSessions(filters?: SessionFilters) {
  const getKey = (pageIndex: number, previousPageData: PaginatedResponse<Session> | null) => {
    if (previousPageData && !previousPageData.data.length) return null

    const params = new URLSearchParams()
    params.append('page', String(pageIndex + 1))
    params.append('pageSize', String(PAGE_SIZE))

    if (filters?.clubId) params.append('clubId', filters.clubId)
    if (filters?.type) params.append('type', filters.type)
    if (filters?.skillLevel) params.append('skillLevel', filters.skillLevel)
    if (filters?.startDate) params.append('startDate', filters.startDate)
    if (filters?.endDate) params.append('endDate', filters.endDate)
    if (filters?.includesCancelled !== undefined)
      params.append('includesCancelled', String(filters.includesCancelled))

    return `/api/sessions?${params.toString()}`
  }

  return useSWRInfinite<PaginatedResponse<Session>>(getKey, fetcher, {
    revalidateFirstPage: false,
  })
}

/**
 * Fetch a single session by ID
 */
export function useSession(id: string | null) {
  return useSWR<Session>(id ? `/api/sessions/${id}` : null, fetcher)
}

/**
 * Fetch upcoming sessions, optionally for a specific club
 */
export function useUpcomingSessions(clubId?: string, limit: number = 10) {
  const params = new URLSearchParams()
  if (clubId) params.append('clubId', clubId)
  params.append('limit', String(limit))

  return useSWR<Session[]>(`/api/sessions/upcoming?${params.toString()}`, fetcher)
}

/**
 * Fetch current user's RSVPs
 */
export function useMyRsvps() {
  return useSWR<SessionRsvp[]>('/api/users/me/rsvps', fetcher)
}

/**
 * Fetch RSVPs for a specific session
 */
export function useSessionRsvps(sessionId: string | null) {
  return useSWR<SessionRsvp[]>(sessionId ? `/api/sessions/${sessionId}/rsvps` : null, fetcher)
}

/**
 * Fetch current user's RSVP for a specific session
 */
export function useMySessionRsvp(sessionId: string | null) {
  return useSWR<SessionRsvp | null>(
    sessionId ? `/api/sessions/${sessionId}/rsvp` : null,
    fetcher
  )
}

import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'
import { fetcher } from '@/lib/fetcher'

// Types
interface Competition {
  id: string
  name: string
  description: string | null
  organizingBody: string | null
  startDate: string
  endDate: string
  registrationDeadline: string | null
  registrationUrl: string | null
  venue: string | null
  city: string
  country: string
  latitude: number | null
  longitude: number | null
  skillLevels: string[]
  ageGroups: string[]
  imageUrl: string | null
  websiteUrl: string | null
  isPublished: boolean
  createdAt: string
  updatedAt: string
  _count?: {
    followers: number
  }
}

interface CompetitionResult {
  id: string
  competitionId: string
  placement: number
  teamName: string
  division: string | null
  points: number | null
  notes: string | null
}

interface CompetitionFilters {
  country?: string
  skillLevel?: string
  startDate?: string
  endDate?: string
  search?: string
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
 * Fetch list of competitions with optional filters
 */
export function useCompetitions(filters?: CompetitionFilters) {
  const params = new URLSearchParams()
  if (filters?.country) params.append('country', filters.country)
  if (filters?.skillLevel) params.append('skillLevel', filters.skillLevel)
  if (filters?.startDate) params.append('startDate', filters.startDate)
  if (filters?.endDate) params.append('endDate', filters.endDate)
  if (filters?.search) params.append('search', filters.search)

  const queryString = params.toString()
  const url = `/api/competitions${queryString ? `?${queryString}` : ''}`

  return useSWR<PaginatedResponse<Competition>>(url, fetcher)
}

/**
 * Fetch competitions with infinite scroll
 */
export function useInfiniteCompetitions(filters?: CompetitionFilters) {
  const getKey = (pageIndex: number, previousPageData: PaginatedResponse<Competition> | null) => {
    if (previousPageData && !previousPageData.data.length) return null

    const params = new URLSearchParams()
    params.append('page', String(pageIndex + 1))
    params.append('pageSize', String(PAGE_SIZE))

    if (filters?.country) params.append('country', filters.country)
    if (filters?.skillLevel) params.append('skillLevel', filters.skillLevel)
    if (filters?.startDate) params.append('startDate', filters.startDate)
    if (filters?.endDate) params.append('endDate', filters.endDate)
    if (filters?.search) params.append('search', filters.search)

    return `/api/competitions?${params.toString()}`
  }

  return useSWRInfinite<PaginatedResponse<Competition>>(getKey, fetcher, {
    revalidateFirstPage: false,
  })
}

/**
 * Fetch a single competition by ID
 */
export function useCompetition(id: string | null) {
  return useSWR<Competition>(id ? `/api/competitions/${id}` : null, fetcher)
}

/**
 * Fetch upcoming competitions
 */
export function useUpcomingCompetitions(limit: number = 10) {
  return useSWR<Competition[]>(`/api/competitions/upcoming?limit=${limit}`, fetcher)
}

/**
 * Fetch competitions the user is following
 */
export function useFollowedCompetitions() {
  return useSWR<Competition[]>('/api/users/me/following/competitions', fetcher)
}

/**
 * Check if user is following a competition
 */
export function useIsFollowing(competitionId: string | null) {
  return useSWR<{ isFollowing: boolean }>(
    competitionId ? `/api/competitions/${competitionId}/following` : null,
    fetcher
  )
}

/**
 * Fetch results for a competition
 */
export function useCompetitionResults(competitionId: string | null) {
  return useSWR<CompetitionResult[]>(
    competitionId ? `/api/competitions/${competitionId}/results` : null,
    fetcher
  )
}

import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'
import { fetcher } from '@/lib/fetcher'

// Types
interface Club {
  id: string
  name: string
  slug: string
  description: string | null
  foundedYear: number | null
  imageUrl: string | null
  coverImageUrl: string | null
  website: string | null
  email: string | null
  phone: string | null
  country: string
  city: string
  address: string | null
  latitude: number
  longitude: number
  isVerified: boolean
  isActive: boolean
  welcomesBeginners: boolean
  languagesSpoken: string[]
  createdAt: string
  updatedAt: string
  _count?: {
    members: number
    sessions: number
  }
}

interface ClubMember {
  id: string
  userId: string
  clubId: string
  role: string
  joinedAt: string
  isActive: boolean
  user: {
    id: string
    firstName: string | null
    lastName: string | null
    imageUrl: string | null
    skillLevel: string
  }
}

interface ClubFilters {
  skillLevel?: string
  country?: string
  city?: string
  welcomesBeginners?: boolean
  hasEquipment?: boolean
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
 * Fetch list of clubs with optional filters
 */
export function useClubs(filters?: ClubFilters) {
  const params = new URLSearchParams()
  if (filters?.skillLevel) params.append('skillLevel', filters.skillLevel)
  if (filters?.country) params.append('country', filters.country)
  if (filters?.city) params.append('city', filters.city)
  if (filters?.welcomesBeginners !== undefined)
    params.append('welcomesBeginners', String(filters.welcomesBeginners))
  if (filters?.hasEquipment !== undefined)
    params.append('hasEquipment', String(filters.hasEquipment))
  if (filters?.search) params.append('search', filters.search)

  const queryString = params.toString()
  const url = `/api/clubs${queryString ? `?${queryString}` : ''}`

  return useSWR<PaginatedResponse<Club>>(url, fetcher)
}

/**
 * Fetch clubs with infinite scroll pagination
 */
export function useInfiniteClubs(filters?: ClubFilters) {
  const getKey = (pageIndex: number, previousPageData: PaginatedResponse<Club> | null) => {
    // Reached the end
    if (previousPageData && !previousPageData.data.length) return null

    const params = new URLSearchParams()
    params.append('page', String(pageIndex + 1))
    params.append('pageSize', String(PAGE_SIZE))

    if (filters?.skillLevel) params.append('skillLevel', filters.skillLevel)
    if (filters?.country) params.append('country', filters.country)
    if (filters?.city) params.append('city', filters.city)
    if (filters?.welcomesBeginners !== undefined)
      params.append('welcomesBeginners', String(filters.welcomesBeginners))
    if (filters?.hasEquipment !== undefined)
      params.append('hasEquipment', String(filters.hasEquipment))
    if (filters?.search) params.append('search', filters.search)

    return `/api/clubs?${params.toString()}`
  }

  return useSWRInfinite<PaginatedResponse<Club>>(getKey, fetcher, {
    revalidateFirstPage: false,
  })
}

/**
 * Fetch a single club by ID or slug
 */
export function useClub(idOrSlug: string | null) {
  return useSWR<Club>(idOrSlug ? `/api/clubs/${idOrSlug}` : null, fetcher)
}

/**
 * Fetch nearby clubs based on coordinates
 */
export function useNearbyClubs(lat: number | null, lng: number | null, radiusKm: number = 50) {
  const url =
    lat !== null && lng !== null
      ? `/api/clubs/nearby?lat=${lat}&lng=${lng}&radius=${radiusKm}`
      : null

  return useSWR<Club[]>(url, fetcher)
}

/**
 * Fetch members of a club
 */
export function useClubMembers(clubId: string | null) {
  return useSWR<ClubMember[]>(clubId ? `/api/clubs/${clubId}/members` : null, fetcher)
}

/**
 * Check if current user is a member of a club
 */
export function useClubMembership(clubId: string | null) {
  return useSWR<{ isMember: boolean; role: string | null }>(
    clubId ? `/api/clubs/${clubId}/membership` : null,
    fetcher
  )
}

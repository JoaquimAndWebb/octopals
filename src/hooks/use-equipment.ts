import useSWR from 'swr'
import { fetcher } from '@/lib/fetcher'

// Types
interface Equipment {
  id: string
  clubId: string
  type: string
  name: string
  description: string | null
  size: string | null
  condition: string
  purchaseDate: string | null
  imageUrl: string | null
  serialNumber: string | null
  isAvailable: boolean
  notes: string | null
  createdAt: string
  updatedAt: string
  club?: {
    id: string
    name: string
    slug: string
  }
}

interface EquipmentCheckout {
  id: string
  equipmentId: string
  userId: string
  checkedOutAt: string
  dueDate: string | null
  returnedAt: string | null
  conditionOut: string
  conditionIn: string | null
  photoOutUrl: string | null
  photoInUrl: string | null
  notes: string | null
  approvedById: string | null
  equipment?: Equipment
  user?: {
    id: string
    firstName: string | null
    lastName: string | null
    imageUrl: string | null
  }
}

interface EquipmentFilters {
  type?: string
  size?: string
  condition?: string
  isAvailable?: boolean
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

/**
 * Fetch all equipment with optional filters
 */
export function useEquipment(filters?: EquipmentFilters) {
  const params = new URLSearchParams()
  if (filters?.type) params.append('type', filters.type)
  if (filters?.size) params.append('size', filters.size)
  if (filters?.condition) params.append('condition', filters.condition)
  if (filters?.isAvailable !== undefined)
    params.append('isAvailable', String(filters.isAvailable))

  const queryString = params.toString()
  const url = `/api/equipment${queryString ? `?${queryString}` : ''}`

  return useSWR<PaginatedResponse<Equipment>>(url, fetcher)
}

/**
 * Fetch equipment for a specific club
 */
export function useClubEquipment(clubId: string | null, filters?: EquipmentFilters) {
  const params = new URLSearchParams()
  if (filters?.type) params.append('type', filters.type)
  if (filters?.size) params.append('size', filters.size)
  if (filters?.condition) params.append('condition', filters.condition)
  if (filters?.isAvailable !== undefined)
    params.append('isAvailable', String(filters.isAvailable))

  const queryString = params.toString()
  const url = clubId
    ? `/api/clubs/${clubId}/equipment${queryString ? `?${queryString}` : ''}`
    : null

  return useSWR<PaginatedResponse<Equipment>>(url, fetcher)
}

/**
 * Fetch a single equipment item by ID
 */
export function useEquipmentItem(id: string | null) {
  return useSWR<Equipment>(id ? `/api/equipment/${id}` : null, fetcher)
}

/**
 * Fetch current user's active checkouts
 */
export function useMyCheckouts() {
  return useSWR<EquipmentCheckout[]>('/api/users/me/checkouts', fetcher)
}

/**
 * Fetch checkout history for a specific equipment item
 */
export function useEquipmentHistory(equipmentId: string | null) {
  return useSWR<EquipmentCheckout[]>(
    equipmentId ? `/api/equipment/${equipmentId}/history` : null,
    fetcher
  )
}

/**
 * Fetch all checkouts for a club (admin)
 */
export function useClubCheckouts(clubId: string | null, includeReturned: boolean = false) {
  const url = clubId
    ? `/api/clubs/${clubId}/checkouts?includeReturned=${includeReturned}`
    : null

  return useSWR<EquipmentCheckout[]>(url, fetcher)
}

import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'
import { fetcher } from '@/lib/fetcher'

// Types
interface TrainingLog {
  id: string
  userId: string
  date: string
  type: string
  durationMins: number
  intensity: number | null
  notes: string | null
  createdAt: string
}

interface BreathHoldRecord {
  id: string
  userId: string
  date: string
  durationSeconds: number
  type: string
  tableRound: number | null
  restSeconds: number | null
  heartRateBefore: number | null
  heartRateAfter: number | null
  difficulty: number | null
  notes: string | null
  createdAt: string
}

interface TrainingStats {
  totalSessions: number
  totalMinutes: number
  averageIntensity: number
  sessionsThisWeek: number
  sessionsThisMonth: number
  minutesThisWeek: number
  minutesThisMonth: number
  streakDays: number
  longestStreak: number
  byType: {
    type: string
    count: number
    totalMinutes: number
  }[]
}

interface PersonalBest {
  type: string
  durationSeconds: number
  date: string
  recordId: string
}

interface TrainingFilters {
  type?: string
  startDate?: string
  endDate?: string
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
 * Fetch training logs with optional filters
 */
export function useTrainingLogs(filters?: TrainingFilters) {
  const params = new URLSearchParams()
  if (filters?.type) params.append('type', filters.type)
  if (filters?.startDate) params.append('startDate', filters.startDate)
  if (filters?.endDate) params.append('endDate', filters.endDate)

  const queryString = params.toString()
  const url = `/api/training/logs${queryString ? `?${queryString}` : ''}`

  return useSWR<PaginatedResponse<TrainingLog>>(url, fetcher)
}

/**
 * Fetch training logs with infinite scroll
 */
export function useInfiniteTrainingLogs(filters?: TrainingFilters) {
  const getKey = (pageIndex: number, previousPageData: PaginatedResponse<TrainingLog> | null) => {
    if (previousPageData && !previousPageData.data.length) return null

    const params = new URLSearchParams()
    params.append('page', String(pageIndex + 1))
    params.append('pageSize', String(PAGE_SIZE))

    if (filters?.type) params.append('type', filters.type)
    if (filters?.startDate) params.append('startDate', filters.startDate)
    if (filters?.endDate) params.append('endDate', filters.endDate)

    return `/api/training/logs?${params.toString()}`
  }

  return useSWRInfinite<PaginatedResponse<TrainingLog>>(getKey, fetcher, {
    revalidateFirstPage: false,
  })
}

/**
 * Fetch breath hold records
 */
export function useBreathHoldRecords(type?: string) {
  const url = type
    ? `/api/training/breath-holds?type=${type}`
    : '/api/training/breath-holds'

  return useSWR<PaginatedResponse<BreathHoldRecord>>(url, fetcher)
}

/**
 * Fetch breath hold records with infinite scroll
 */
export function useInfiniteBreathHoldRecords(type?: string) {
  const getKey = (
    pageIndex: number,
    previousPageData: PaginatedResponse<BreathHoldRecord> | null
  ) => {
    if (previousPageData && !previousPageData.data.length) return null

    const params = new URLSearchParams()
    params.append('page', String(pageIndex + 1))
    params.append('pageSize', String(PAGE_SIZE))
    if (type) params.append('type', type)

    return `/api/training/breath-holds?${params.toString()}`
  }

  return useSWRInfinite<PaginatedResponse<BreathHoldRecord>>(getKey, fetcher, {
    revalidateFirstPage: false,
  })
}

/**
 * Fetch training statistics
 */
export function useTrainingStats() {
  return useSWR<TrainingStats>('/api/training/stats', fetcher)
}

/**
 * Fetch personal bests for breath holds
 */
export function usePersonalBests() {
  return useSWR<PersonalBest[]>('/api/training/personal-bests', fetcher)
}

/**
 * Fetch recent training activity
 */
export function useRecentTraining(limit: number = 10) {
  return useSWR<TrainingLog[]>(`/api/training/logs/recent?limit=${limit}`, fetcher)
}

/**
 * Fetch training data for a specific date range (for charts)
 */
export function useTrainingChartData(startDate: string, endDate: string) {
  return useSWR<{
    logs: TrainingLog[]
    breathHolds: BreathHoldRecord[]
  }>(`/api/training/chart-data?startDate=${startDate}&endDate=${endDate}`, fetcher)
}

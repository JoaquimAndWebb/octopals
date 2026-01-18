import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'
import { fetcher } from '@/lib/fetcher'
import { realtimeConfig } from '@/lib/swr-config'

// Types
interface Notification {
  id: string
  userId: string
  type: string
  title: string
  body: string
  linkUrl: string | null
  isRead: boolean
  createdAt: string
}

interface NotificationGroup {
  date: string
  notifications: Notification[]
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
 * Fetch notifications for the current user
 */
export function useNotifications() {
  return useSWR<PaginatedResponse<Notification>>('/api/notifications', fetcher, {
    ...realtimeConfig,
    refreshInterval: 30000, // Poll every 30 seconds
  })
}

/**
 * Fetch notifications with infinite scroll
 */
export function useInfiniteNotifications() {
  const getKey = (
    pageIndex: number,
    previousPageData: PaginatedResponse<Notification> | null
  ) => {
    if (previousPageData && !previousPageData.data.length) return null

    const params = new URLSearchParams()
    params.append('page', String(pageIndex + 1))
    params.append('pageSize', String(PAGE_SIZE))

    return `/api/notifications?${params.toString()}`
  }

  return useSWRInfinite<PaginatedResponse<Notification>>(getKey, fetcher, {
    revalidateFirstPage: true,
  })
}

/**
 * Fetch unread notification count
 */
export function useUnreadNotificationCount() {
  return useSWR<{ count: number }>('/api/notifications/unread-count', fetcher, {
    ...realtimeConfig,
    refreshInterval: 15000, // Poll every 15 seconds
  })
}

/**
 * Fetch notifications grouped by date
 */
export function useGroupedNotifications() {
  return useSWR<NotificationGroup[]>('/api/notifications/grouped', fetcher, {
    ...realtimeConfig,
  })
}

/**
 * Fetch only unread notifications
 */
export function useUnreadNotifications() {
  return useSWR<Notification[]>('/api/notifications?unreadOnly=true', fetcher, {
    ...realtimeConfig,
    refreshInterval: 15000,
  })
}

/**
 * Fetch notifications by type
 */
export function useNotificationsByType(type: string) {
  return useSWR<PaginatedResponse<Notification>>(
    `/api/notifications?type=${type}`,
    fetcher
  )
}

// Notification type constants for filtering
export const NOTIFICATION_TYPES = {
  SESSION_REMINDER: 'SESSION_REMINDER',
  SESSION_CANCELLED: 'SESSION_CANCELLED',
  SESSION_UPDATED: 'SESSION_UPDATED',
  RSVP_UPDATE: 'RSVP_UPDATE',
  NEW_MESSAGE: 'NEW_MESSAGE',
  CLUB_ANNOUNCEMENT: 'CLUB_ANNOUNCEMENT',
  CLUB_INVITATION: 'CLUB_INVITATION',
  MEMBERSHIP_APPROVED: 'MEMBERSHIP_APPROVED',
  EQUIPMENT_DUE: 'EQUIPMENT_DUE',
  EQUIPMENT_OVERDUE: 'EQUIPMENT_OVERDUE',
  COMPETITION_REMINDER: 'COMPETITION_REMINDER',
  BADGE_EARNED: 'BADGE_EARNED',
  SYSTEM: 'SYSTEM',
} as const

export type NotificationType = (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES]

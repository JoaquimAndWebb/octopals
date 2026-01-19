import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'
import { fetcher } from '@/lib/fetcher'
import { realtimeConfig } from '@/lib/swr-config'

// Types
interface User {
  id: string
  firstName: string | null
  lastName: string | null
  imageUrl: string | null
  username: string | null
}

interface Message {
  id: string
  senderId: string
  receiverId: string | null
  clubId: string | null
  content: string
  isRead: boolean
  createdAt: string
  sender: User
  receiver?: User
}

interface Conversation {
  id: string
  participantId: string
  participant: User
  lastMessage: Message | null
  unreadCount: number
  updatedAt: string
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

const PAGE_SIZE = 50

/**
 * Fetch all conversations for the current user
 */
export function useConversations() {
  return useSWR<Conversation[]>('/api/messages', fetcher, {
    ...realtimeConfig,
    refreshInterval: 10000, // Poll every 10 seconds for new conversations
  })
}

/**
 * Fetch messages in a conversation with a specific user
 */
export function useMessages(conversationId: string | null) {
  return useSWR<Message[]>(
    conversationId ? `/api/messages/${conversationId}` : null,
    fetcher,
    {
      ...realtimeConfig,
      refreshInterval: 5000, // Poll every 5 seconds for new messages
    }
  )
}

/**
 * Fetch messages with infinite scroll (for long conversations)
 */
export function useInfiniteMessages(conversationId: string | null) {
  const getKey = (pageIndex: number, previousPageData: PaginatedResponse<Message> | null) => {
    if (!conversationId) return null
    if (previousPageData && !previousPageData.data.length) return null

    const params = new URLSearchParams()
    params.append('page', String(pageIndex + 1))
    params.append('pageSize', String(PAGE_SIZE))

    return `/api/messages/${conversationId}?${params.toString()}`
  }

  return useSWRInfinite<PaginatedResponse<Message>>(getKey, fetcher, {
    revalidateFirstPage: true,
    revalidateAll: false,
  })
}

/**
 * Fetch unread message count
 */
export function useUnreadCount() {
  return useSWR<{ count: number }>('/api/messages/unread-count', fetcher, {
    ...realtimeConfig,
    refreshInterval: 30000, // Poll every 30 seconds
  })
}

/**
 * Fetch conversation with a specific user
 */
export function useConversationWith(userId: string | null) {
  return useSWR<Conversation | null>(
    userId ? `/api/messages/conversation/${userId}` : null,
    fetcher
  )
}

/**
 * Search conversations
 */
export function useSearchConversations(query: string) {
  const url = query ? `/api/messages/search?q=${encodeURIComponent(query)}` : null
  return useSWR<Conversation[]>(url, fetcher)
}

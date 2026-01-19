"use client"

import * as React from "react"
import { formatDistanceToNow } from "date-fns"
import { MessageCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/ui/empty-state"

export interface Conversation {
  id: string
  participantId: string
  participant: {
    id: string
    firstName: string | null
    lastName: string | null
    imageUrl: string | null
    username: string | null
  }
  lastMessage: {
    id: string
    content: string
    createdAt: string
    isRead: boolean
  } | null
  unreadCount: number
  updatedAt: string
}

interface ConversationListProps {
  conversations: Conversation[]
  selectedId?: string
  onSelect: (conversation: Conversation) => void
  isLoading?: boolean
  emptyMessage?: string
  className?: string
}

function getDisplayName(participant: Conversation["participant"]): string {
  if (participant.firstName || participant.lastName) {
    return [participant.firstName, participant.lastName].filter(Boolean).join(" ")
  }
  return participant.username || "Unknown User"
}

function getInitials(participant: Conversation["participant"]): string {
  const first = participant.firstName?.charAt(0) || ""
  const last = participant.lastName?.charAt(0) || ""
  if (first || last) {
    return (first + last).toUpperCase()
  }
  return participant.username?.charAt(0).toUpperCase() || "?"
}

function ConversationSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
      <Skeleton className="h-3 w-12" />
    </div>
  )
}

function ConversationItem({
  conversation,
  isSelected,
  onClick,
}: {
  conversation: Conversation
  isSelected: boolean
  onClick: () => void
}) {
  const displayName = getDisplayName(conversation.participant)
  const initials = getInitials(conversation.participant)
  const hasUnread = conversation.unreadCount > 0

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-accent",
        isSelected && "bg-accent"
      )}
    >
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src={conversation.participant.imageUrl || undefined} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        {hasUnread && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
            {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "truncate font-medium",
              hasUnread && "text-foreground"
            )}
          >
            {displayName}
          </span>
          {conversation.lastMessage && (
            <span className="shrink-0 text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(conversation.lastMessage.createdAt), {
                addSuffix: false,
              })}
            </span>
          )}
        </div>
        {conversation.lastMessage && (
          <p
            className={cn(
              "truncate text-sm",
              hasUnread
                ? "font-medium text-foreground"
                : "text-muted-foreground"
            )}
          >
            {conversation.lastMessage.content}
          </p>
        )}
      </div>
    </button>
  )
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
  isLoading = false,
  emptyMessage = "No conversations yet",
  className,
}: ConversationListProps) {
  if (isLoading) {
    return (
      <div className={cn("divide-y", className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <ConversationSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <EmptyState
        icon={MessageCircle}
        title="No conversations"
        description={emptyMessage}
        className={cn("border-0", className)}
      />
    )
  }

  return (
    <div className={cn("divide-y", className)}>
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          isSelected={selectedId === conversation.id}
          onClick={() => onSelect(conversation)}
        />
      ))}
    </div>
  )
}

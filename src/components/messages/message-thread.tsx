"use client"

import * as React from "react"
import { format, isToday, isYesterday, isSameDay } from "date-fns"

import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { MessageBubble, type Message } from "./message-bubble"

interface MessageThreadProps {
  messages: Message[]
  currentUserId: string
  isLoading?: boolean
  className?: string
}

function MessageSkeleton({ isOwn }: { isOwn: boolean }) {
  return (
    <div className={cn("flex gap-2", isOwn ? "flex-row-reverse" : "flex-row")}>
      {!isOwn && <Skeleton className="h-8 w-8 rounded-full" />}
      {isOwn && <div className="w-8" />}
      <div className={cn("space-y-1", isOwn ? "items-end" : "items-start")}>
        <Skeleton
          className={cn(
            "h-10 rounded-2xl",
            isOwn ? "w-48 rounded-br-md" : "w-56 rounded-bl-md"
          )}
        />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  )
}

function DateDivider({ date }: { date: Date }) {
  let label: string

  if (isToday(date)) {
    label = "Today"
  } else if (isYesterday(date)) {
    label = "Yesterday"
  } else {
    label = format(date, "MMMM d, yyyy")
  }

  return (
    <div className="flex items-center gap-4 py-4">
      <div className="h-px flex-1 bg-border" />
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  )
}

export function MessageThread({
  messages,
  currentUserId,
  isLoading = false,
  className,
}: MessageThreadProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  if (isLoading) {
    return (
      <div className={cn("flex flex-col gap-4 overflow-y-auto p-4", className)}>
        <MessageSkeleton isOwn={false} />
        <MessageSkeleton isOwn={true} />
        <MessageSkeleton isOwn={false} />
        <MessageSkeleton isOwn={true} />
        <MessageSkeleton isOwn={false} />
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-1 items-center justify-center p-4",
          className
        )}
      >
        <p className="text-sm text-muted-foreground">
          No messages yet. Start the conversation!
        </p>
      </div>
    )
  }

  // Group messages by date
  const groupedMessages: { date: Date; messages: Message[] }[] = []
  let currentGroup: { date: Date; messages: Message[] } | null = null

  for (const message of messages) {
    const messageDate = new Date(message.createdAt)

    if (!currentGroup || !isSameDay(currentGroup.date, messageDate)) {
      currentGroup = { date: messageDate, messages: [] }
      groupedMessages.push(currentGroup)
    }

    currentGroup.messages.push(message)
  }

  return (
    <div
      ref={scrollRef}
      className={cn("flex flex-col gap-2 overflow-y-auto p-4", className)}
    >
      {groupedMessages.map((group, groupIndex) => (
        <React.Fragment key={groupIndex}>
          <DateDivider date={group.date} />
          {group.messages.map((message, messageIndex) => {
            const isOwn = message.sender.id === currentUserId
            const prevMessage = group.messages[messageIndex - 1]
            const showAvatar =
              !prevMessage || prevMessage.sender.id !== message.sender.id

            return (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={isOwn}
                showAvatar={showAvatar}
              />
            )
          })}
        </React.Fragment>
      ))}
    </div>
  )
}

"use client"

import * as React from "react"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export interface Message {
  id: string
  content: string
  createdAt: string
  isRead: boolean
  sender: {
    id: string
    firstName: string | null
    lastName: string | null
    imageUrl: string | null
  }
}

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
  showAvatar?: boolean
  className?: string
}

function getInitials(firstName: string | null, lastName: string | null): string {
  const first = firstName?.charAt(0) || ""
  const last = lastName?.charAt(0) || ""
  return (first + last).toUpperCase() || "?"
}

export function MessageBubble({
  message,
  isOwn,
  showAvatar = true,
  className,
}: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "flex gap-2",
        isOwn ? "flex-row-reverse" : "flex-row",
        className
      )}
    >
      {showAvatar && !isOwn && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={message.sender.imageUrl || undefined} />
          <AvatarFallback className="text-xs">
            {getInitials(message.sender.firstName, message.sender.lastName)}
          </AvatarFallback>
        </Avatar>
      )}
      {showAvatar && isOwn && <div className="w-8 shrink-0" />}

      <div
        className={cn(
          "max-w-[70%] space-y-1",
          isOwn ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-2 text-sm",
            isOwn
              ? "bg-primary text-primary-foreground rounded-br-md"
              : "bg-muted rounded-bl-md"
          )}
        >
          {message.content}
        </div>
        <p
          className={cn(
            "text-xs text-muted-foreground",
            isOwn ? "text-right" : "text-left"
          )}
        >
          {format(new Date(message.createdAt), "h:mm a")}
        </p>
      </div>
    </div>
  )
}

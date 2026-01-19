"use client"

import * as React from "react"
import { Bell, Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import { Separator } from "@/components/ui/separator"
import { NotificationItem, type Notification } from "./notification-item"

interface NotificationListProps {
  notifications: Notification[]
  isLoading?: boolean
  onMarkAsRead?: (id: string) => void
  onMarkAllAsRead?: () => void
  emptyMessage?: string
  className?: string
}

function NotificationSkeleton() {
  return (
    <div className="flex gap-3 p-3">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  )
}

export function NotificationList({
  notifications,
  isLoading = false,
  onMarkAsRead,
  onMarkAllAsRead,
  emptyMessage = "No notifications",
  className,
}: NotificationListProps) {
  const hasUnread = notifications.some((n) => !n.isRead)

  if (isLoading) {
    return (
      <div className={cn("divide-y", className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <NotificationSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <EmptyState
        icon={Bell}
        title="All caught up!"
        description={emptyMessage}
        className={cn("border-0 py-8", className)}
      />
    )
  }

  return (
    <div className={className}>
      {hasUnread && onMarkAllAsRead && (
        <>
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-sm font-medium">Notifications</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAllAsRead}
              className="h-auto py-1 text-xs"
            >
              <Check className="mr-1 h-3 w-3" />
              Mark all as read
            </Button>
          </div>
          <Separator />
        </>
      )}

      <div className="divide-y">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onMarkAsRead={onMarkAsRead}
          />
        ))}
      </div>
    </div>
  )
}

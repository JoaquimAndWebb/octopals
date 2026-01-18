"use client"

import * as React from "react"
import { Bell } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { NotificationList } from "./notification-list"
import type { Notification } from "./notification-item"

interface NotificationBellProps {
  notifications?: Notification[]
  unreadCount?: number
  isLoading?: boolean
  onMarkAsRead?: (id: string) => void
  onMarkAllAsRead?: () => void
  onOpenChange?: (open: boolean) => void
  className?: string
}

export function NotificationBell({
  notifications = [],
  unreadCount = 0,
  isLoading = false,
  onMarkAsRead,
  onMarkAllAsRead,
  onOpenChange,
  className,
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    onOpenChange?.(open)
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("relative", className)}
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span
              className={cn(
                "absolute -right-0.5 -top-0.5 flex items-center justify-center rounded-full bg-primary text-primary-foreground",
                unreadCount > 9 ? "h-5 min-w-5 px-1 text-[10px]" : "h-5 w-5 text-xs"
              )}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-80 p-0 sm:w-96"
        sideOffset={8}
      >
        <div className="max-h-[400px] overflow-y-auto">
          <NotificationList
            notifications={notifications}
            isLoading={isLoading}
            onMarkAsRead={onMarkAsRead}
            onMarkAllAsRead={onMarkAllAsRead}
          />
        </div>
        {notifications.length > 0 && (
          <div className="border-t p-2">
            <Button
              variant="ghost"
              className="w-full text-sm"
              asChild
            >
              <a href="/notifications">View all notifications</a>
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

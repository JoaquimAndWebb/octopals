"use client"

import * as React from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import {
  Bell,
  Calendar,
  MessageCircle,
  Users,
  Trophy,
  Package,
  Award,
  AlertCircle,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { type NotificationType } from "@/lib/constants"

export interface Notification {
  id: string
  type: NotificationType
  title: string
  body: string
  linkUrl: string | null
  isRead: boolean
  createdAt: string
}

interface NotificationItemProps {
  notification: Notification
  onMarkAsRead?: (id: string) => void
  className?: string
}

const notificationIcons: Record<NotificationType, LucideIcon> = {
  SESSION_REMINDER: Calendar,
  SESSION_CANCELLED: Calendar,
  SESSION_UPDATED: Calendar,
  RSVP_UPDATE: Calendar,
  NEW_MESSAGE: MessageCircle,
  CLUB_ANNOUNCEMENT: Users,
  CLUB_INVITATION: Users,
  MEMBERSHIP_APPROVED: Users,
  EQUIPMENT_DUE: Package,
  EQUIPMENT_OVERDUE: Package,
  COMPETITION_REMINDER: Trophy,
  BADGE_EARNED: Award,
  SYSTEM: AlertCircle,
}

const notificationColors: Record<NotificationType, string> = {
  SESSION_REMINDER: "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  SESSION_CANCELLED: "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400",
  SESSION_UPDATED: "bg-yellow-100 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400",
  RSVP_UPDATE: "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  NEW_MESSAGE: "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400",
  CLUB_ANNOUNCEMENT: "bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400",
  CLUB_INVITATION: "bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400",
  MEMBERSHIP_APPROVED: "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400",
  EQUIPMENT_DUE: "bg-yellow-100 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400",
  EQUIPMENT_OVERDUE: "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400",
  COMPETITION_REMINDER: "bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400",
  BADGE_EARNED: "bg-yellow-100 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400",
  SYSTEM: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
}

export function NotificationItem({
  notification,
  onMarkAsRead,
  className,
}: NotificationItemProps) {
  const Icon = notificationIcons[notification.type] || Bell
  const iconColorClass = notificationColors[notification.type] || notificationColors.SYSTEM

  const handleClick = () => {
    if (!notification.isRead && onMarkAsRead) {
      onMarkAsRead(notification.id)
    }
  }

  const content = (
    <div
      className={cn(
        "flex gap-3 p-3 transition-colors",
        !notification.isRead && "bg-accent/50",
        notification.linkUrl && "cursor-pointer hover:bg-accent",
        className
      )}
      onClick={handleClick}
    >
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
          iconColorClass
        )}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="flex-1 space-y-1 overflow-hidden">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              "text-sm",
              !notification.isRead && "font-medium"
            )}
          >
            {notification.title}
          </p>
          {!notification.isRead && (
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
          )}
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {notification.body}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
          })}
        </p>
      </div>
    </div>
  )

  if (notification.linkUrl) {
    return (
      <Link href={notification.linkUrl} className="block">
        {content}
      </Link>
    )
  }

  return content
}

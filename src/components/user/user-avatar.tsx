"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn, getInitials, getInitialsFromFullName } from "@/lib/utils"

const avatarSizeVariants = cva("relative", {
  variants: {
    size: {
      xs: "h-6 w-6 text-[10px]",
      sm: "h-8 w-8 text-xs",
      md: "h-10 w-10 text-sm",
      lg: "h-14 w-14 text-base",
      xl: "h-20 w-20 text-lg",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

const onlineIndicatorVariants = cva(
  "absolute bottom-0 right-0 rounded-full border-2 border-background bg-green-500",
  {
    variants: {
      size: {
        xs: "h-1.5 w-1.5",
        sm: "h-2 w-2",
        md: "h-2.5 w-2.5",
        lg: "h-3.5 w-3.5",
        xl: "h-4 w-4",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

export interface UserAvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarSizeVariants> {
  src?: string | null
  alt?: string
  firstName?: string | null
  lastName?: string | null
  fullName?: string | null
  showOnlineIndicator?: boolean
  isOnline?: boolean
}

function UserAvatar({
  src,
  alt,
  firstName,
  lastName,
  fullName,
  size,
  showOnlineIndicator = false,
  isOnline = false,
  className,
  ...props
}: UserAvatarProps) {
  const initials = fullName
    ? getInitialsFromFullName(fullName)
    : getInitials(firstName, lastName)

  const displayName =
    fullName || [firstName, lastName].filter(Boolean).join(" ") || "User"

  return (
    <div className={cn("relative inline-block", className)} {...props}>
      <Avatar className={cn(avatarSizeVariants({ size }))}>
        <AvatarImage src={src || undefined} alt={alt || displayName} />
        <AvatarFallback className="bg-primary/10 text-primary font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>
      {showOnlineIndicator && isOnline && (
        <span
          className={cn(onlineIndicatorVariants({ size }))}
          aria-label="Online"
        />
      )}
    </div>
  )
}

export { UserAvatar, avatarSizeVariants }

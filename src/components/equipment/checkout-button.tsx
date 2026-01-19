"use client"

import * as React from "react"
import { ShoppingCart, Loader2, CheckCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CheckoutButtonProps {
  isAvailable: boolean
  isCheckedOutByMe?: boolean
  onCheckout?: () => Promise<void>
  onReturn?: () => Promise<void>
  size?: "default" | "sm" | "lg"
  className?: string
}

export function CheckoutButton({
  isAvailable,
  isCheckedOutByMe = false,
  onCheckout,
  onReturn,
  size = "default",
  className,
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false)

  const handleClick = async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      if (isCheckedOutByMe) {
        await onReturn?.()
      } else if (isAvailable) {
        await onCheckout?.()
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Already checked out by current user - show return button
  if (isCheckedOutByMe) {
    return (
      <Button
        variant="outline"
        size={size}
        onClick={handleClick}
        disabled={isLoading}
        className={cn(className)}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <CheckCircle className="mr-2 h-4 w-4" />
        )}
        Return Equipment
      </Button>
    )
  }

  // Not available - disabled button
  if (!isAvailable) {
    return (
      <Button
        variant="secondary"
        size={size}
        disabled
        className={cn(className)}
      >
        <ShoppingCart className="mr-2 h-4 w-4" />
        Unavailable
      </Button>
    )
  }

  // Available - checkout button
  return (
    <Button
      variant="default"
      size={size}
      onClick={handleClick}
      disabled={isLoading}
      className={cn(className)}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <ShoppingCart className="mr-2 h-4 w-4" />
      )}
      Request Checkout
    </Button>
  )
}

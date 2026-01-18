"use client"

import * as React from "react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  description?: string
  error?: string
  required?: boolean
  htmlFor?: string
  children: React.ReactNode
}

function FormField({
  label,
  description,
  error,
  required = false,
  htmlFor,
  children,
  className,
  ...props
}: FormFieldProps) {
  const id = React.useId()
  const fieldId = htmlFor || id
  const descriptionId = `${fieldId}-description`
  const errorId = `${fieldId}-error`

  return (
    <div className={cn("space-y-2", className)} {...props}>
      {label && (
        <Label
          htmlFor={fieldId}
          className={cn(
            "flex items-center gap-1",
            error && "text-destructive"
          )}
        >
          {label}
          {required && (
            <span className="text-destructive" aria-hidden="true">
              *
            </span>
          )}
        </Label>
      )}
      {description && (
        <p
          id={descriptionId}
          className="text-sm text-muted-foreground"
        >
          {description}
        </p>
      )}
      <div
        aria-describedby={
          [description ? descriptionId : undefined, error ? errorId : undefined]
            .filter(Boolean)
            .join(" ") || undefined
        }
      >
        {children}
      </div>
      {error && (
        <p
          id={errorId}
          className="text-sm text-destructive"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  )
}

export { FormField }

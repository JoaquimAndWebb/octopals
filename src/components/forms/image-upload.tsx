"use client"

import * as React from "react"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface ImageUploadProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string | null
  onChange?: (value: string | null) => void
  onFileSelect?: (file: File) => void | Promise<void>
  accept?: string
  maxSizeMB?: number
  disabled?: boolean
  error?: string
  placeholder?: string
  aspectRatio?: "square" | "video" | "cover"
}

function ImageUpload({
  value,
  onChange,
  onFileSelect,
  accept = "image/*",
  maxSizeMB = 5,
  disabled = false,
  error,
  placeholder = "Click or drag to upload an image",
  aspectRatio = "square",
  className,
  ...props
}: ImageUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const [localError, setLocalError] = React.useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)

  const displayError = error || localError

  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video",
    cover: "aspect-[3/1]",
  }

  const handleFileChange = async (file: File) => {
    setLocalError(null)

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setLocalError("Please select an image file")
      return
    }

    // Validate file size
    const maxBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxBytes) {
      setLocalError(`Image must be less than ${maxSizeMB}MB`)
      return
    }

    // Create preview URL
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)

    // Call handlers
    if (onFileSelect) {
      await onFileSelect(file)
    }

    // If no onFileSelect, use the preview URL as the value
    if (!onFileSelect && onChange) {
      onChange(url)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileChange(file)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (disabled) return

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileChange(file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleRemove = () => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(null)
    onChange?.(null)
    setLocalError(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click()
    }
  }

  // Cleanup preview URL on unmount
  React.useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const displayImage = previewUrl || value

  return (
    <div className={cn("space-y-2", className)} {...props}>
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "relative overflow-hidden rounded-lg border-2 border-dashed transition-colors",
          aspectRatioClasses[aspectRatio],
          disabled
            ? "cursor-not-allowed bg-muted opacity-50"
            : "cursor-pointer hover:border-primary/50 hover:bg-accent/50",
          isDragging && "border-primary bg-primary/10",
          displayError && "border-destructive",
          displayImage && "border-solid border-border"
        )}
      >
        {displayImage ? (
          <>
            <img
              src={displayImage}
              alt="Preview"
              className="h-full w-full object-cover"
            />
            {!disabled && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100">
                <p className="text-sm text-white">Click to change</p>
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              {isDragging ? (
                <Upload className="h-6 w-6 text-primary" />
              ) : (
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">{placeholder}</p>
            <p className="text-xs text-muted-foreground">
              Max size: {maxSizeMB}MB
            </p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          disabled={disabled}
          className="sr-only"
          aria-label="Upload image"
        />
      </div>

      {displayImage && !disabled && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleRemove}
          className="gap-2"
        >
          <X className="h-4 w-4" />
          Remove Image
        </Button>
      )}

      {displayError && (
        <p className="text-sm text-destructive" role="alert">
          {displayError}
        </p>
      )}
    </div>
  )
}

export { ImageUpload }

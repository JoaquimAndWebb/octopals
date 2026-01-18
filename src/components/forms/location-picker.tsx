"use client"

import * as React from "react"
import { MapPin, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface LocationValue {
  address: string
  latitude?: number | null
  longitude?: number | null
  country?: string | null
}

export interface LocationPickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: LocationValue | null
  onChange?: (value: LocationValue | null) => void
  placeholder?: string
  disabled?: boolean
  error?: string
  showMapPreview?: boolean
  mapboxToken?: string
}

function LocationPicker({
  value,
  onChange,
  placeholder = "Enter a location...",
  disabled = false,
  error,
  showMapPreview = true,
  mapboxToken,
  className,
  ...props
}: LocationPickerProps) {
  const [inputValue, setInputValue] = React.useState(value?.address || "")

  // Sync input with external value changes
  React.useEffect(() => {
    if (value?.address !== undefined) {
      setInputValue(value.address)
    }
  }, [value?.address])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    onChange?.({
      address: newValue,
      latitude: null,
      longitude: null,
      country: null,
    })
  }

  const handleClear = () => {
    setInputValue("")
    onChange?.(null)
  }

  const hasCoordinates = value?.latitude != null && value?.longitude != null
  const mapPreviewUrl =
    showMapPreview && hasCoordinates && mapboxToken
      ? `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s+3b82f6(${value.longitude},${value.latitude})/${value.longitude},${value.latitude},12,0/300x150@2x?access_token=${mapboxToken}`
      : null

  return (
    <div className={cn("space-y-3", className)} {...props}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          className={cn("pl-9 pr-9", error && "border-destructive")}
        />
        {inputValue && !disabled && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear location</span>
          </Button>
        )}
      </div>

      {/* Map Preview */}
      {mapPreviewUrl && (
        <div className="relative overflow-hidden rounded-lg border">
          <img
            src={mapPreviewUrl}
            alt={`Map showing ${value?.address}`}
            className="h-[150px] w-full object-cover"
          />
          <div className="absolute bottom-2 left-2 rounded bg-background/90 px-2 py-1 text-xs text-foreground">
            {value?.latitude?.toFixed(4)}, {value?.longitude?.toFixed(4)}
          </div>
        </div>
      )}

      {/* Fallback map preview without Mapbox */}
      {showMapPreview && hasCoordinates && !mapboxToken && (
        <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-3">
          <MapPin className="h-4 w-4 text-primary shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-foreground">{value?.address}</p>
            <p className="text-muted-foreground">
              {value?.latitude?.toFixed(4)}, {value?.longitude?.toFixed(4)}
              {value?.country && ` - ${value.country}`}
            </p>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export { LocationPicker }

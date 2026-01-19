"use client"

import * as React from "react"
import { Search, X, Loader2 } from "lucide-react"

import { cn, debounce } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface LocationSearchProps {
  onSearch?: (query: string) => void
  onLocationSelect?: (location: { lat: number; lng: number; name: string }) => void
  placeholder?: string
  className?: string
}

export function LocationSearch({
  onSearch,
  onLocationSelect,
  placeholder = "Search location...",
  className,
}: LocationSearchProps) {
  const [query, setQuery] = React.useState("")
  const [isSearching, setIsSearching] = React.useState(false)
  const [results, setResults] = React.useState<
    Array<{ id: string; name: string; lat: number; lng: number }>
  >([])
  const [showResults, setShowResults] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Debounced search function
  const debouncedSearch = React.useMemo(
    () =>
      debounce(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
          setResults([])
          setIsSearching(false)
          return
        }

        setIsSearching(true)
        onSearch?.(searchQuery)

        // Use Mapbox Geocoding API
        const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
        if (token) {
          try {
            const response = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                searchQuery
              )}.json?access_token=${token}&types=place,locality,neighborhood&limit=5`
            )
            const data = await response.json()

            if (data.features) {
              setResults(
                data.features.map((feature: { id: string; place_name: string; center: [number, number] }) => ({
                  id: feature.id,
                  name: feature.place_name,
                  lng: feature.center[0],
                  lat: feature.center[1],
                }))
              )
            }
          } catch (error) {
            console.error("Location search error:", error)
            setResults([])
          }
        }

        setIsSearching(false)
      }, 300),
    [onSearch]
  )

  React.useEffect(() => {
    debouncedSearch(query)
  }, [query, debouncedSearch])

  // Close results when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleResultSelect = (result: { id: string; name: string; lat: number; lng: number }) => {
    setQuery(result.name)
    setShowResults(false)
    onLocationSelect?.({ lat: result.lat, lng: result.lng, name: result.name })
  }

  const handleClear = () => {
    setQuery("")
    setResults([])
    inputRef.current?.focus()
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowResults(true)}
          placeholder={placeholder}
          className="pl-9 pr-9"
        />
        {isSearching ? (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        ) : query ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear</span>
          </Button>
        ) : null}
      </div>

      {/* Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
          <ul className="max-h-60 overflow-auto py-1">
            {results.map((result) => (
              <li key={result.id}>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted"
                  onClick={() => handleResultSelect(result)}
                >
                  <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="line-clamp-1">{result.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

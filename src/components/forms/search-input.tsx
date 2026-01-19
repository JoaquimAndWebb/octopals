"use client"

import * as React from "react"
import { Search, X, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn, debounce } from "@/lib/utils"

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value?: string
  onChange?: (value: string) => void
  onSearch?: (value: string) => void
  debounceMs?: number
  loading?: boolean
  showClearButton?: boolean
  error?: string
}

function SearchInput({
  value: controlledValue,
  onChange,
  onSearch,
  debounceMs = 300,
  loading = false,
  showClearButton = true,
  error,
  placeholder = "Search...",
  disabled,
  className,
  ...props
}: SearchInputProps) {
  const [internalValue, setInternalValue] = React.useState(
    controlledValue || ""
  )
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Determine if component is controlled
  const isControlled = controlledValue !== undefined
  const displayValue = isControlled ? controlledValue : internalValue

  // Create debounced search handler
  const debouncedSearch = React.useMemo(
    () =>
      debounce((searchValue: string) => {
        onSearch?.(searchValue)
      }, debounceMs),
    [onSearch, debounceMs]
  )

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value

    if (!isControlled) {
      setInternalValue(newValue)
    }

    onChange?.(newValue)
    debouncedSearch(newValue)
  }

  // Handle clear button
  const handleClear = () => {
    if (!isControlled) {
      setInternalValue("")
    }

    onChange?.("")
    onSearch?.("")
    inputRef.current?.focus()
  }

  // Sync internal state with controlled value
  React.useEffect(() => {
    if (isControlled && controlledValue !== internalValue) {
      setInternalValue(controlledValue)
    }
  }, [controlledValue, isControlled, internalValue])

  const showClear = showClearButton && displayValue && !disabled && !loading

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        {loading ? (
          <Loader2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        ) : (
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        )}
        <Input
          ref={inputRef}
          type="search"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "pl-9",
            showClear && "pr-9",
            error && "border-destructive focus-visible:ring-destructive"
          )}
          {...props}
        />
        {showClear && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export { SearchInput }

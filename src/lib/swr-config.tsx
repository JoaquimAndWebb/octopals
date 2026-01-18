'use client'

import { SWRConfig } from 'swr'
import { ReactNode } from 'react'
import { fetcher } from './fetcher'

interface SWRProviderProps {
  children: ReactNode
}

/**
 * SWR Provider with default configuration
 * Wrap your app with this provider to enable SWR globally
 */
export function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        fetcher,
        // Revalidation settings
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        revalidateIfStale: true,

        // Retry settings
        shouldRetryOnError: true,
        errorRetryCount: 3,
        errorRetryInterval: 5000,

        // Deduplication
        dedupingInterval: 2000,

        // Loading timeout
        loadingTimeout: 3000,

        // Focus throttle
        focusThrottleInterval: 5000,

        // Keep previous data while loading new data
        keepPreviousData: true,

        // Error handler
        onError: (error, key) => {
          if (process.env.NODE_ENV === 'development') {
            console.error(`SWR Error for key "${key}":`, error)
          }
          // In production, you might want to send to error tracking service
        },

        // Loading slow handler
        onLoadingSlow: (key) => {
          if (process.env.NODE_ENV === 'development') {
            console.warn(`SWR loading slow for key "${key}"`)
          }
        },
      }}
    >
      {children}
    </SWRConfig>
  )
}

/**
 * SWR configuration for infinite loading
 */
export const infiniteConfig = {
  revalidateFirstPage: false,
  revalidateAll: false,
  persistSize: true,
}

/**
 * SWR configuration for real-time data
 */
export const realtimeConfig = {
  refreshInterval: 30000, // 30 seconds
  revalidateOnFocus: true,
}

/**
 * SWR configuration for static data that rarely changes
 */
export const staticConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  revalidateIfStale: false,
  dedupingInterval: 60000, // 1 minute
}

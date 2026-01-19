"use client"

import * as React from "react"
import Map, { NavigationControl, GeolocateControl } from "react-map-gl/mapbox"
import "mapbox-gl/dist/mapbox-gl.css"

import { cn } from "@/lib/utils"
import { useAppStore } from "@/stores/use-app-store"
import { ClubMarker, type ClubMarkerData } from "./club-marker"
import { ClubPopup } from "./club-popup"

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

interface ClubMapProps {
  clubs: ClubMarkerData[]
  onMarkerClick?: (clubId: string) => void
  className?: string
  initialViewState?: {
    latitude: number
    longitude: number
    zoom: number
  }
}

const DEFAULT_VIEW_STATE = {
  latitude: 40.7128,
  longitude: -74.006,
  zoom: 10,
}

export function ClubMap({
  clubs,
  onMarkerClick,
  className,
  initialViewState,
}: ClubMapProps) {
  // Using any for the map ref since react-map-gl's MapRef type is not properly exported in v8
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = React.useRef<any>(null)
  const { currentLocation } = useAppStore()
  const [selectedClub, setSelectedClub] = React.useState<ClubMarkerData | null>(null)
  const [viewState, setViewState] = React.useState(() => {
    if (initialViewState) return initialViewState
    if (currentLocation) {
      return {
        latitude: currentLocation.lat,
        longitude: currentLocation.lng,
        zoom: 11,
      }
    }
    return DEFAULT_VIEW_STATE
  })

  // Update view when user location changes
  React.useEffect(() => {
    if (currentLocation && !initialViewState) {
      setViewState((prev) => ({
        ...prev,
        latitude: currentLocation.lat,
        longitude: currentLocation.lng,
      }))
    }
  }, [currentLocation, initialViewState])

  const handleMarkerClick = (club: ClubMarkerData) => {
    setSelectedClub(club)
    onMarkerClick?.(club.id)

    // Center the map on the selected club
    mapRef.current?.flyTo({
      center: [club.longitude, club.latitude],
      zoom: 14,
      duration: 500,
    })
  }

  const handlePopupClose = () => {
    setSelectedClub(null)
  }

  if (!MAPBOX_TOKEN) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground",
          className
        )}
      >
        Map unavailable: Mapbox token not configured
      </div>
    )
  }

  return (
    <div className={cn("relative overflow-hidden rounded-lg", className)}>
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: "100%", height: "100%" }}
      >
        <NavigationControl position="top-right" />
        <GeolocateControl
          position="top-right"
          trackUserLocation
          showUserHeading
        />

        {/* Club Markers */}
        {clubs.map((club) => (
          <ClubMarker
            key={club.id}
            club={club}
            onClick={() => handleMarkerClick(club)}
            isSelected={selectedClub?.id === club.id}
          />
        ))}

        {/* Popup for selected club */}
        {selectedClub && (
          <ClubPopup club={selectedClub} onClose={handlePopupClose} />
        )}
      </Map>
    </div>
  )
}

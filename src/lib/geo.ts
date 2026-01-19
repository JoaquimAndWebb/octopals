/**
 * Geolocation utilities for OctoPals
 */

// Earth's radius in kilometers
const EARTH_RADIUS_KM = 6371

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Convert radians to degrees
 */
function toDegrees(radians: number): number {
  return radians * (180 / Math.PI)
}

/**
 * Calculate the distance between two points using the Haversine formula
 * @param lat1 - Latitude of point 1
 * @param lng1 - Longitude of point 1
 * @param lat2 - Latitude of point 2
 * @param lng2 - Longitude of point 2
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return EARTH_RADIUS_KM * c
}

/**
 * Bounding box coordinates
 */
export interface BoundingBox {
  minLat: number
  maxLat: number
  minLng: number
  maxLng: number
}

/**
 * Get a bounding box around a point with a given radius
 * Useful for initial database queries before applying precise distance filtering
 * @param lat - Center latitude
 * @param lng - Center longitude
 * @param radiusKm - Radius in kilometers
 * @returns Bounding box coordinates
 */
export function getBoundingBox(lat: number, lng: number, radiusKm: number): BoundingBox {
  // Angular distance in radians on a great circle
  const angularDistance = radiusKm / EARTH_RADIUS_KM

  const latRad = toRadians(lat)
  const lngRad = toRadians(lng)

  // Calculate latitude bounds
  const minLatRad = latRad - angularDistance
  const maxLatRad = latRad + angularDistance

  // Calculate longitude bounds (accounting for latitude)
  const deltaLng = Math.asin(Math.sin(angularDistance) / Math.cos(latRad))
  const minLngRad = lngRad - deltaLng
  const maxLngRad = lngRad + deltaLng

  return {
    minLat: toDegrees(minLatRad),
    maxLat: toDegrees(maxLatRad),
    minLng: toDegrees(minLngRad),
    maxLng: toDegrees(maxLngRad),
  }
}

/**
 * Check if a point is within a bounding box
 */
export function isWithinBoundingBox(
  lat: number,
  lng: number,
  box: BoundingBox
): boolean {
  return (
    lat >= box.minLat &&
    lat <= box.maxLat &&
    lng >= box.minLng &&
    lng <= box.maxLng
  )
}

/**
 * Check if a point is within a given radius of another point
 */
export function isWithinRadius(
  centerLat: number,
  centerLng: number,
  pointLat: number,
  pointLng: number,
  radiusKm: number
): boolean {
  return calculateDistance(centerLat, centerLng, pointLat, pointLng) <= radiusKm
}

/**
 * Sort an array of items by distance from a point
 */
export function sortByDistance<T extends { latitude: number; longitude: number }>(
  items: T[],
  fromLat: number,
  fromLng: number
): (T & { distance: number })[] {
  return items
    .map((item) => ({
      ...item,
      distance: calculateDistance(fromLat, fromLng, item.latitude, item.longitude),
    }))
    .sort((a, b) => a.distance - b.distance)
}

/**
 * Filter items within a radius and sort by distance
 */
export function filterByRadius<T extends { latitude: number; longitude: number }>(
  items: T[],
  centerLat: number,
  centerLng: number,
  radiusKm: number
): (T & { distance: number })[] {
  return items
    .map((item) => ({
      ...item,
      distance: calculateDistance(centerLat, centerLng, item.latitude, item.longitude),
    }))
    .filter((item) => item.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance)
}

/**
 * Get the center point of multiple coordinates
 */
export function getCenterPoint(
  coordinates: { lat: number; lng: number }[]
): { lat: number; lng: number } | null {
  if (coordinates.length === 0) return null

  if (coordinates.length === 1) {
    return { lat: coordinates[0].lat, lng: coordinates[0].lng }
  }

  let x = 0
  let y = 0
  let z = 0

  for (const coord of coordinates) {
    const latRad = toRadians(coord.lat)
    const lngRad = toRadians(coord.lng)

    x += Math.cos(latRad) * Math.cos(lngRad)
    y += Math.cos(latRad) * Math.sin(lngRad)
    z += Math.sin(latRad)
  }

  const total = coordinates.length
  x /= total
  y /= total
  z /= total

  const centralLng = Math.atan2(y, x)
  const centralSquareRoot = Math.sqrt(x * x + y * y)
  const centralLat = Math.atan2(z, centralSquareRoot)

  return {
    lat: toDegrees(centralLat),
    lng: toDegrees(centralLng),
  }
}

/**
 * Format coordinates for display
 */
export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? "N" : "S"
  const lngDir = lng >= 0 ? "E" : "W"

  return `${Math.abs(lat).toFixed(4)}${latDir}, ${Math.abs(lng).toFixed(4)}${lngDir}`
}

/**
 * Validate latitude value
 */
export function isValidLatitude(lat: number): boolean {
  return lat >= -90 && lat <= 90
}

/**
 * Validate longitude value
 */
export function isValidLongitude(lng: number): boolean {
  return lng >= -180 && lng <= 180
}

/**
 * Validate coordinate pair
 */
export function isValidCoordinates(lat: number, lng: number): boolean {
  return isValidLatitude(lat) && isValidLongitude(lng)
}

/**
 * Get bearing between two points in degrees
 */
export function getBearing(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const lat1Rad = toRadians(lat1)
  const lat2Rad = toRadians(lat2)
  const dLng = toRadians(lng2 - lng1)

  const y = Math.sin(dLng) * Math.cos(lat2Rad)
  const x =
    Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng)

  const bearing = toDegrees(Math.atan2(y, x))
  return (bearing + 360) % 360 // Normalize to 0-360
}

/**
 * Get compass direction from bearing
 */
export function getCompassDirection(bearing: number): string {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
  const index = Math.round(bearing / 45) % 8
  return directions[index]
}

import { create } from 'zustand'

interface Location {
  lat: number
  lng: number
}

interface AppState {
  currentLocation: Location | null
  isLocating: boolean
  setLocation: (location: Location | null) => void
  detectLocation: () => Promise<void>
}

export const useAppStore = create<AppState>((set) => ({
  currentLocation: null,
  isLocating: false,
  setLocation: (location) => set({ currentLocation: location }),
  detectLocation: async () => {
    set({ isLocating: true })
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })
      set({
        currentLocation: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
        isLocating: false,
      })
    } catch (error) {
      set({ isLocating: false })
      throw error
    }
  },
}))

import { create } from 'zustand'

type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ELITE'
type SessionType = 'TRAINING' | 'SCRIMMAGE' | 'PICKUP' | 'BEGINNER_INTRO' | 'COMPETITION_PREP' | 'SOCIAL'

interface FilterState {
  // Club filters
  skillLevel: SkillLevel | null
  distance: number // km radius
  welcomesBeginners: boolean | null
  hasEquipment: boolean | null
  country: string | null
  city: string | null

  // Session filters
  sessionDays: string[]
  sessionTypes: SessionType[]
  startDate: Date | null
  endDate: Date | null

  // Search
  searchQuery: string

  // Actions
  setSkillLevel: (level: SkillLevel | null) => void
  setDistance: (distance: number) => void
  setWelcomesBeginners: (welcomes: boolean | null) => void
  setHasEquipment: (has: boolean | null) => void
  setCountry: (country: string | null) => void
  setCity: (city: string | null) => void
  setSessionDays: (days: string[]) => void
  setSessionTypes: (types: SessionType[]) => void
  setDateRange: (start: Date | null, end: Date | null) => void
  setSearchQuery: (query: string) => void
  resetFilters: () => void
}

const initialState = {
  skillLevel: null,
  distance: 50, // Default 50km radius
  welcomesBeginners: null,
  hasEquipment: null,
  country: null,
  city: null,
  sessionDays: [],
  sessionTypes: [],
  startDate: null,
  endDate: null,
  searchQuery: '',
}

export const useFilterStore = create<FilterState>((set) => ({
  ...initialState,

  setSkillLevel: (level) => set({ skillLevel: level }),
  setDistance: (distance) => set({ distance }),
  setWelcomesBeginners: (welcomes) => set({ welcomesBeginners: welcomes }),
  setHasEquipment: (has) => set({ hasEquipment: has }),
  setCountry: (country) => set({ country }),
  setCity: (city) => set({ city }),
  setSessionDays: (days) => set({ sessionDays: days }),
  setSessionTypes: (types) => set({ sessionTypes: types }),
  setDateRange: (start, end) => set({ startDate: start, endDate: end }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  resetFilters: () => set(initialState),
}))

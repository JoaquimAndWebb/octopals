"use client"

import { useState } from "react"
import { Map, List, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ClubList } from "@/components/clubs/club-list"
import { ClubFilters } from "@/components/clubs/club-filters"
import type { Club } from "@/components/clubs/club-card"

// Mock data for demonstration
const mockClubs: Club[] = [
  {
    id: "1",
    name: "Sydney Stingrays",
    slug: "sydney-stingrays",
    city: "Sydney",
    country: "Australia",
    memberCount: 45,
    rating: 4.8,
    skillLevels: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
    imageUrl: null,
    isVerified: true,
  },
  {
    id: "2",
    name: "Melbourne Makos",
    slug: "melbourne-makos",
    city: "Melbourne",
    country: "Australia",
    memberCount: 62,
    rating: 4.6,
    skillLevels: ["INTERMEDIATE", "ADVANCED", "ELITE"],
    imageUrl: null,
    isVerified: true,
  },
  {
    id: "3",
    name: "London Octopus",
    slug: "london-octopus",
    city: "London",
    country: "United Kingdom",
    memberCount: 38,
    rating: 4.9,
    skillLevels: ["BEGINNER", "INTERMEDIATE"],
    imageUrl: null,
    isVerified: true,
  },
  {
    id: "4",
    name: "Cape Town Sharks",
    slug: "cape-town-sharks",
    city: "Cape Town",
    country: "South Africa",
    memberCount: 28,
    rating: 4.7,
    skillLevels: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
    imageUrl: null,
    isVerified: false,
  },
]

export default function ClubsPage() {
  const [viewMode, setViewMode] = useState<"list" | "map">("list")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isLoading] = useState(false)

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="border-b bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Find a Club
              </h1>
              <p className="mt-1 text-gray-600">
                Discover underwater hockey clubs near you
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex rounded-lg border p-1">
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="gap-2"
                >
                  <List className="h-4 w-4" />
                  <span className="hidden sm:inline">List</span>
                </Button>
                <Button
                  variant={viewMode === "map" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("map")}
                  className="gap-2"
                >
                  <Map className="h-4 w-4" />
                  <span className="hidden sm:inline">Map</span>
                </Button>
              </div>

              {/* Mobile Filter Toggle */}
              <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 lg:hidden">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-80">
                  <DialogHeader>
                    <DialogTitle>Filters</DialogTitle>
                  </DialogHeader>
                  <div className="mt-6">
                    <ClubFilters />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden w-64 shrink-0 lg:block">
              <div className="sticky top-24 rounded-lg border bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">Filters</h2>
                </div>
                <ClubFilters />
              </div>
            </aside>

            {/* Results */}
            <div className="flex-1">
              {viewMode === "list" ? (
                <div>
                  <p className="mb-6 text-sm text-gray-500">
                    Showing {mockClubs.length} clubs
                  </p>
                  <ClubList
                    clubs={mockClubs}
                    isLoading={isLoading}
                    emptyMessage="No clubs found matching your filters. Try adjusting your search criteria."
                  />
                </div>
              ) : (
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border bg-gray-100 lg:aspect-[16/9]">
                  {/* Map placeholder */}
                  <div className="flex h-full flex-col items-center justify-center text-gray-500">
                    <Map className="mb-4 h-12 w-12" />
                    <p className="text-lg font-medium">Interactive Map</p>
                    <p className="mt-1 text-sm">
                      Map view requires location permissions
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => setViewMode("list")}
                    >
                      Switch to List View
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

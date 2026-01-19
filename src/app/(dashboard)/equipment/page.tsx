"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { EquipmentList } from "@/components/equipment/equipment-list"
import type { Equipment } from "@/components/equipment/equipment-card"

// Mock data
const mockEquipment: Equipment[] = [
  {
    id: "1",
    name: "Competition Stick",
    type: "STICK",
    condition: "GOOD",
    size: "M",
    isAvailable: true,
    club: { id: "1", name: "Sydney Stingrays", slug: "sydney-stingrays" },
    imageUrl: null,
  },
  {
    id: "2",
    name: "Protective Glove",
    type: "GLOVE",
    condition: "NEW",
    size: "L",
    isAvailable: true,
    club: { id: "1", name: "Sydney Stingrays", slug: "sydney-stingrays" },
    imageUrl: null,
  },
  {
    id: "3",
    name: "Low Volume Mask",
    type: "MASK",
    condition: "GOOD",
    size: "ONE_SIZE",
    isAvailable: false,
    club: { id: "1", name: "Sydney Stingrays", slug: "sydney-stingrays" },
    imageUrl: null,
  },
  {
    id: "4",
    name: "Racing Fins",
    type: "FINS",
    condition: "FAIR",
    size: "L",
    isAvailable: true,
    club: { id: "1", name: "Sydney Stingrays", slug: "sydney-stingrays" },
    imageUrl: null,
  },
  {
    id: "5",
    name: "Junior Stick Set",
    type: "STICK",
    condition: "GOOD",
    size: "JUNIOR",
    isAvailable: true,
    club: { id: "1", name: "Sydney Stingrays", slug: "sydney-stingrays" },
    imageUrl: null,
  },
  {
    id: "6",
    name: "Practice Pucks (Set of 10)",
    type: "PUCK",
    condition: "GOOD",
    size: "ONE_SIZE",
    isAvailable: true,
    club: { id: "1", name: "Sydney Stingrays", slug: "sydney-stingrays" },
    imageUrl: null,
  },
]

export default function EquipmentPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading] = useState(false)

  const handleItemClick = (equipment: Equipment) => {
    window.location.href = `/equipment/${equipment.id}`
  }

  const filteredEquipment = mockEquipment.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const availableCount = mockEquipment.filter((e) => e.isAvailable).length
  const checkedOutCount = mockEquipment.filter((e) => !e.isAvailable).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Equipment</h1>
          <p className="mt-1 text-muted-foreground">
            Browse and borrow equipment from your clubs
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockEquipment.length}</div>
            <p className="text-xs text-muted-foreground">From your clubs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{availableCount}</div>
            <p className="text-xs text-muted-foreground">Ready to borrow</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Checked Out
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{checkedOutCount}</div>
            <p className="text-xs text-muted-foreground">Currently in use</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search equipment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="cursor-pointer hover:bg-accent">
            All Types
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-accent">
            Sticks
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-accent">
            Fins
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-accent">
            Masks
          </Badge>
        </div>
      </div>

      {/* Equipment Grid */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Available Equipment</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Available
              </Badge>
              <Badge variant="outline" className="gap-1">
                <span className="h-2 w-2 rounded-full bg-yellow-500" />
                Checked Out
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <EquipmentList
            equipment={filteredEquipment}
            isLoading={isLoading}
            onItemClick={handleItemClick}
            emptyMessage="No equipment found matching your search."
          />
        </CardContent>
      </Card>
    </div>
  )
}

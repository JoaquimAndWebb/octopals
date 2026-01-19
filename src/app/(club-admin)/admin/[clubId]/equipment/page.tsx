"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Package, Search, MoreHorizontal, Edit, Trash2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { EquipmentForm } from "@/components/equipment/equipment-form"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  EQUIPMENT_TYPE_LABELS,
  EQUIPMENT_CONDITION_LABELS,
  EQUIPMENT_CONDITION_COLORS,
  type EquipmentType,
  type EquipmentCondition,
} from "@/lib/constants"

interface EquipmentPageProps {
  params: Promise<{ clubId: string }>
}

// Mock data
const mockEquipment = [
  {
    id: "1",
    name: "Competition Stick",
    type: "STICK" as EquipmentType,
    condition: "GOOD" as EquipmentCondition,
    available: true,
    checkedOutBy: null,
    checkedOutAt: null,
  },
  {
    id: "2",
    name: "Protective Glove - Large",
    type: "GLOVE" as EquipmentType,
    condition: "NEW" as EquipmentCondition,
    available: true,
    checkedOutBy: null,
    checkedOutAt: null,
  },
  {
    id: "3",
    name: "Low Volume Mask",
    type: "MASK" as EquipmentType,
    condition: "GOOD" as EquipmentCondition,
    available: false,
    checkedOutBy: { firstName: "Sarah", lastName: "Lee" },
    checkedOutAt: new Date(Date.now() - 3 * 86400000),
  },
  {
    id: "4",
    name: "Racing Fins - Size L",
    type: "FINS" as EquipmentType,
    condition: "FAIR" as EquipmentCondition,
    available: true,
    checkedOutBy: null,
    checkedOutAt: null,
  },
]

const overdueItems = [
  {
    id: "o1",
    name: "Junior Stick Set",
    type: "STICK" as EquipmentType,
    checkedOutBy: { firstName: "Tom", lastName: "Brown" },
    checkedOutAt: new Date(Date.now() - 14 * 86400000),
    dueDate: new Date(Date.now() - 7 * 86400000),
  },
]

export default function EquipmentPage(_props: EquipmentPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const filteredEquipment = mockEquipment.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const availableCount = mockEquipment.filter((e) => e.available).length
  const checkedOutCount = mockEquipment.filter((e) => !e.available).length

  const handleAddEquipment = async (data: unknown) => {
    console.log("Adding equipment:", data)
    setIsAddDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="../"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Admin Dashboard
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Equipment Management</h1>
          <p className="mt-1 text-muted-foreground">
            Track and manage club equipment inventory
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Equipment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Equipment</DialogTitle>
              <DialogDescription>
                Add a new item to your club&apos;s equipment inventory.
              </DialogDescription>
            </DialogHeader>
            <EquipmentForm
              onSubmit={handleAddEquipment}
              submitLabel="Add Equipment"
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Overdue Alert */}
      {overdueItems.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-red-800">
                  {overdueItems.length} overdue item{overdueItems.length > 1 ? "s" : ""}
                </p>
                <div className="mt-2 space-y-2">
                  {overdueItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="text-red-700">
                        {item.name} - checked out by {item.checkedOutBy.firstName} {item.checkedOutBy.lastName}
                      </span>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-300">
                        Send Reminder
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockEquipment.length}</div>
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
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overdue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueItems.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Equipment List */}
      <Tabs defaultValue="all" className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="all">
              All ({mockEquipment.length})
            </TabsTrigger>
            <TabsTrigger value="available">
              Available ({availableCount})
            </TabsTrigger>
            <TabsTrigger value="checked-out">
              Checked Out ({checkedOutCount})
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <TabsContent value="all">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredEquipment.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{item.name}</p>
                          <Badge
                            className={EQUIPMENT_CONDITION_COLORS[item.condition]}
                          >
                            {EQUIPMENT_CONDITION_LABELS[item.condition]}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{EQUIPMENT_TYPE_LABELS[item.type]}</span>
                          {item.checkedOutBy && (
                            <span className="flex items-center gap-1">
                              Checked out by {item.checkedOutBy.firstName} {item.checkedOutBy.lastName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={item.available ? "default" : "secondary"}
                        className={
                          item.available
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }
                      >
                        {item.available ? "Available" : "Checked Out"}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Item
                          </DropdownMenuItem>
                          {!item.available && (
                            <DropdownMenuItem>
                              Mark as Returned
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Item
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="available">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredEquipment
                  .filter((item) => item.available)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {EQUIPMENT_TYPE_LABELS[item.type]}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={EQUIPMENT_CONDITION_COLORS[item.condition]}
                      >
                        {EQUIPMENT_CONDITION_LABELS[item.condition]}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="checked-out">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredEquipment
                  .filter((item) => !item.available)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="text-[10px]">
                                {item.checkedOutBy?.firstName.charAt(0)}
                                {item.checkedOutBy?.lastName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            {item.checkedOutBy?.firstName} {item.checkedOutBy?.lastName}
                            <span>-</span>
                            <span>
                              Since {item.checkedOutAt?.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Mark Returned
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

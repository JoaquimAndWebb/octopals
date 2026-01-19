import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Package, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  APP_NAME,
  EQUIPMENT_TYPE_LABELS,
  EQUIPMENT_CONDITION_LABELS,
  EQUIPMENT_SIZE_LABELS,
  EQUIPMENT_CONDITION_COLORS,
  type EquipmentType,
  type EquipmentCondition,
  type EquipmentSize,
} from "@/lib/constants"

interface EquipmentPageProps {
  params: Promise<{ id: string }>
}

// Mock data
const mockEquipment = {
  id: "1",
  name: "Competition Stick",
  type: "STICK" as EquipmentType,
  condition: "GOOD" as EquipmentCondition,
  size: "M" as EquipmentSize,
  description: "High-quality competition stick suitable for intermediate to advanced players. Made from durable composite materials with excellent grip.",
  available: true,
  club: {
    id: "1",
    name: "Sydney Stingrays",
    imageUrl: null,
  },
  imageUrl: null,
  notes: "Recently refinished. Great for scrimmages and competitions.",
  lastCheckedOut: new Date(Date.now() - 7 * 86400000),
  checkoutHistory: [
    {
      id: "1",
      user: { firstName: "Alex", lastName: "Chen", imageUrl: null },
      checkedOut: new Date(Date.now() - 14 * 86400000),
      returned: new Date(Date.now() - 7 * 86400000),
    },
    {
      id: "2",
      user: { firstName: "Maria", lastName: "Santos", imageUrl: null },
      checkedOut: new Date(Date.now() - 30 * 86400000),
      returned: new Date(Date.now() - 21 * 86400000),
    },
  ],
}

export async function generateMetadata(_props: EquipmentPageProps): Promise<Metadata> {
  return {
    title: `${mockEquipment.name} - ${APP_NAME}`,
    description: `${EQUIPMENT_TYPE_LABELS[mockEquipment.type]} - ${mockEquipment.description}`,
  }
}

export default async function EquipmentDetailPage(_props: EquipmentPageProps) {
  // In production, fetch equipment data based on id
  if (!mockEquipment) {
    notFound()
  }

  const equipment = mockEquipment

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/equipment"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Equipment
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Equipment Details */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-2xl">{equipment.name}</CardTitle>
                    <Badge
                      className={EQUIPMENT_CONDITION_COLORS[equipment.condition]}
                    >
                      {EQUIPMENT_CONDITION_LABELS[equipment.condition]}
                    </Badge>
                  </div>
                  <CardDescription className="mt-1">
                    {EQUIPMENT_TYPE_LABELS[equipment.type]} - Size {EQUIPMENT_SIZE_LABELS[equipment.size]}
                  </CardDescription>
                </div>
                <Badge
                  variant={equipment.available ? "default" : "secondary"}
                  className={
                    equipment.available
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }
                >
                  {equipment.available ? "Available" : "Checked Out"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Image Placeholder */}
              <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                <Package className="h-16 w-16 text-muted-foreground" />
              </div>

              <div>
                <h3 className="mb-2 font-medium">Description</h3>
                <p className="text-muted-foreground">{equipment.description}</p>
              </div>

              {equipment.notes && (
                <>
                  <Separator />
                  <div>
                    <h3 className="mb-2 font-medium">Notes</h3>
                    <p className="text-muted-foreground">{equipment.notes}</p>
                  </div>
                </>
              )}

              <Separator />

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium">{EQUIPMENT_TYPE_LABELS[equipment.type]}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Size</p>
                  <p className="font-medium">{EQUIPMENT_SIZE_LABELS[equipment.size]}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Condition</p>
                  <p className="font-medium">{EQUIPMENT_CONDITION_LABELS[equipment.condition]}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Checkout History */}
          <Card>
            <CardHeader>
              <CardTitle>Checkout History</CardTitle>
              <CardDescription>Recent borrowing activity</CardDescription>
            </CardHeader>
            <CardContent>
              {equipment.checkoutHistory.length > 0 ? (
                <div className="space-y-4">
                  {equipment.checkoutHistory.map((checkout) => (
                    <div
                      key={checkout.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={checkout.user.imageUrl || undefined} />
                          <AvatarFallback>
                            {checkout.user.firstName.charAt(0)}
                            {checkout.user.lastName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {checkout.user.firstName} {checkout.user.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {checkout.checkedOut.toLocaleDateString()} -{" "}
                            {checkout.returned.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="gap-1 text-green-600">
                        <CheckCircle className="h-3 w-3" />
                        Returned
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No checkout history yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Checkout Card */}
          <Card>
            <CardHeader>
              <CardTitle>Borrow Equipment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {equipment.available ? (
                <>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Available for checkout</span>
                  </div>
                  <Button className="w-full">
                    Check Out Equipment
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    By checking out, you agree to return the equipment in good condition
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-yellow-600">
                    <Clock className="h-5 w-5" />
                    <span className="font-medium">Currently checked out</span>
                  </div>
                  <Button variant="outline" className="w-full">
                    Request When Available
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Club Info */}
          <Card>
            <CardHeader>
              <CardTitle>Owned By</CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                href={`/clubs/${equipment.club.id}`}
                className="flex items-center gap-3 rounded-lg p-2 -m-2 hover:bg-accent"
              >
                <Avatar>
                  <AvatarImage src={equipment.club.imageUrl || undefined} />
                  <AvatarFallback>
                    {equipment.club.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{equipment.club.name}</p>
                  <p className="text-sm text-muted-foreground">View club</p>
                </div>
              </Link>
            </CardContent>
          </Card>

          {/* Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>Borrowing Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
                <span>Return within 7 days</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
                <span>Clean equipment before returning</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
                <span>Report any damage immediately</span>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 text-yellow-500" />
                <span>Late returns may affect future borrowing</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

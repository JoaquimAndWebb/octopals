"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  EQUIPMENT_TYPES,
  EQUIPMENT_TYPE_LABELS,
  EQUIPMENT_SIZES,
  EQUIPMENT_SIZE_LABELS,
  EQUIPMENT_CONDITIONS,
  EQUIPMENT_CONDITION_LABELS,
  type EquipmentType,
  type EquipmentSize,
  type EquipmentCondition,
} from "@/lib/constants"

export interface EquipmentFormData {
  name: string
  type: EquipmentType
  description: string
  size: EquipmentSize | null
  condition: EquipmentCondition
  serialNumber: string
  imageUrl: string
  isAvailable: boolean
  notes: string
}

export interface EquipmentFormProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  initialData?: Partial<EquipmentFormData>
  onSubmit: (data: EquipmentFormData) => void | Promise<void>
  loading?: boolean
  submitLabel?: string
}

export function EquipmentForm({
  initialData,
  onSubmit,
  loading = false,
  submitLabel = "Save Equipment",
  className,
  ...props
}: EquipmentFormProps) {
  const [name, setName] = React.useState(initialData?.name || "")
  const [type, setType] = React.useState<EquipmentType>(
    initialData?.type || "STICK"
  )
  const [description, setDescription] = React.useState(
    initialData?.description || ""
  )
  const [size, setSize] = React.useState<EquipmentSize | null>(
    initialData?.size || null
  )
  const [condition, setCondition] = React.useState<EquipmentCondition>(
    initialData?.condition || "GOOD"
  )
  const [serialNumber, setSerialNumber] = React.useState(
    initialData?.serialNumber || ""
  )
  const [imageUrl, setImageUrl] = React.useState(initialData?.imageUrl || "")
  const [isAvailable, setIsAvailable] = React.useState(
    initialData?.isAvailable ?? true
  )
  const [notes, setNotes] = React.useState(initialData?.notes || "")

  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) {
      newErrors.name = "Name is required"
    }
    if (name.length > 100) {
      newErrors.name = "Name must be less than 100 characters"
    }
    if (description.length > 500) {
      newErrors.description = "Description must be less than 500 characters"
    }
    if (imageUrl && !isValidUrl(imageUrl)) {
      newErrors.imageUrl = "Please enter a valid URL"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    await onSubmit({
      name: name.trim(),
      type,
      description: description.trim(),
      size,
      condition,
      serialNumber: serialNumber.trim(),
      imageUrl: imageUrl.trim(),
      isAvailable,
      notes: notes.trim(),
    })
  }

  return (
    <form
      className={cn("space-y-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Finis Stick Pro"
          error={errors.name}
          disabled={loading}
        />
      </div>

      {/* Type and Condition */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="type">Type *</Label>
          <Select
            value={type}
            onValueChange={(value) => setType(value as EquipmentType)}
            disabled={loading}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(EQUIPMENT_TYPES).map((t) => (
                <SelectItem key={t} value={t}>
                  {EQUIPMENT_TYPE_LABELS[t as EquipmentType]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="condition">Condition *</Label>
          <Select
            value={condition}
            onValueChange={(value) => setCondition(value as EquipmentCondition)}
            disabled={loading}
          >
            <SelectTrigger id="condition">
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(EQUIPMENT_CONDITIONS).map((c) => (
                <SelectItem key={c} value={c}>
                  {EQUIPMENT_CONDITION_LABELS[c as EquipmentCondition]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the equipment..."
          rows={3}
          error={errors.description}
          disabled={loading}
        />
      </div>

      {/* Size and Serial Number */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="size">Size</Label>
          <Select
            value={size || "none"}
            onValueChange={(value) =>
              setSize(value === "none" ? null : (value as EquipmentSize))
            }
            disabled={loading}
          >
            <SelectTrigger id="size">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No size</SelectItem>
              {Object.keys(EQUIPMENT_SIZES).map((s) => (
                <SelectItem key={s} value={s}>
                  {EQUIPMENT_SIZE_LABELS[s as EquipmentSize]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="serialNumber">Serial Number</Label>
          <Input
            id="serialNumber"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            placeholder="Optional"
            disabled={loading}
          />
        </div>
      </div>

      {/* Image URL */}
      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
          error={errors.imageUrl}
          disabled={loading}
        />
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional notes..."
          rows={2}
          disabled={loading}
        />
      </div>

      {/* Availability Toggle */}
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label htmlFor="isAvailable" className="cursor-pointer">
            Available for checkout
          </Label>
          <p className="text-sm text-muted-foreground">
            Allow members to request this equipment
          </p>
        </div>
        <Switch
          id="isAvailable"
          checked={isAvailable}
          onCheckedChange={setIsAvailable}
          disabled={loading}
        />
      </div>

      {/* Submit */}
      <Button type="submit" disabled={loading} className="w-full">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitLabel}
      </Button>
    </form>
  )
}

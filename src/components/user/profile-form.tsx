"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { SkillLevelSelector } from "./skill-level-selector"
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from "@/lib/validations/user"
import {
  SKILL_LEVEL_LABELS,
  POSITION_LABELS,
  POSITIONS,
  type SkillLevel,
  type Position,
} from "@/lib/constants"
import { FormField } from "@/components/forms/form-field"

export interface ProfileFormProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  initialData?: Partial<UpdateProfileInput>
  onSubmit: (data: UpdateProfileInput) => void | Promise<void>
  loading?: boolean
  submitLabel?: string
  showSkillLevelSelector?: boolean
}

function ProfileForm({
  initialData,
  onSubmit,
  loading = false,
  submitLabel = "Save Changes",
  showSkillLevelSelector = true,
  className,
  ...props
}: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      bio: initialData?.bio || "",
      location: initialData?.location || "",
      skillLevel: initialData?.skillLevel,
      primaryPosition: initialData?.primaryPosition,
      yearsPlaying: initialData?.yearsPlaying,
    },
  })

  const positions = Object.keys(POSITIONS) as Position[]

  const handleFormSubmit = handleSubmit(async (data) => {
    await onSubmit(data)
  })

  return (
    <form
      className={cn("space-y-6", className)}
      onSubmit={handleFormSubmit}
      {...props}
    >
      {/* Name Fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="First Name"
          required
          error={errors.firstName?.message}
        >
          <Input
            {...register("firstName")}
            placeholder="Enter your first name"
            disabled={loading}
            error={errors.firstName?.message}
          />
        </FormField>

        <FormField label="Last Name" error={errors.lastName?.message}>
          <Input
            {...register("lastName")}
            placeholder="Enter your last name"
            disabled={loading}
            error={errors.lastName?.message}
          />
        </FormField>
      </div>

      {/* Bio */}
      <FormField
        label="Bio"
        description="Tell others about yourself and your underwater hockey experience"
        error={errors.bio?.message}
      >
        <Textarea
          {...register("bio")}
          placeholder="Share a bit about yourself..."
          rows={4}
          disabled={loading}
          error={errors.bio?.message}
        />
      </FormField>

      {/* Location */}
      <FormField
        label="Location"
        description="Your city or region helps others find players nearby"
        error={errors.location?.message}
      >
        <Input
          {...register("location")}
          placeholder="e.g., Sydney, Australia"
          disabled={loading}
          error={errors.location?.message}
        />
      </FormField>

      {/* Skill Level */}
      {showSkillLevelSelector ? (
        <FormField
          label="Skill Level"
          description="Select the level that best describes your current abilities"
          error={errors.skillLevel?.message}
        >
          <Controller
            name="skillLevel"
            control={control}
            render={({ field }) => (
              <SkillLevelSelector
                value={field.value as SkillLevel | undefined}
                onChange={field.onChange}
                disabled={loading}
                error={errors.skillLevel?.message}
              />
            )}
          />
        </FormField>
      ) : (
        <FormField label="Skill Level" error={errors.skillLevel?.message}>
          <Controller
            name="skillLevel"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value || ""}
                onValueChange={field.onChange}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your skill level" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(SKILL_LEVEL_LABELS) as SkillLevel[]).map(
                    (level) => (
                      <SelectItem key={level} value={level}>
                        {SKILL_LEVEL_LABELS[level]}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>
      )}

      {/* Position and Years Playing */}
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Primary Position"
          error={errors.primaryPosition?.message}
        >
          <Controller
            name="primaryPosition"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value || ""}
                onValueChange={field.onChange}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your position" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((position) => (
                    <SelectItem key={position} value={position}>
                      {POSITION_LABELS[position]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>

        <FormField
          label="Years Playing"
          error={errors.yearsPlaying?.message}
        >
          <Input
            type="number"
            min={0}
            max={100}
            {...register("yearsPlaying", { valueAsNumber: true })}
            placeholder="0"
            disabled={loading}
            error={errors.yearsPlaying?.message}
          />
        </FormField>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={loading || !isDirty}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}

export { ProfileForm }

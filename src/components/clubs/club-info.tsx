"use client"

import * as React from "react"
import {
  Mail,
  Phone,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Calendar,
  Shield,
  ExternalLink,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface ClubInfoProps {
  info: {
    contactEmail?: string | null
    contactPhone?: string | null
    website?: string | null
    socialMedia?: {
      facebook?: string | null
      instagram?: string | null
      twitter?: string | null
    } | null
    foundedYear?: number | null
    governingBody?: string | null
  }
  className?: string
}

interface InfoRowProps {
  icon: React.ElementType
  label: string
  value: string
  href?: string
  external?: boolean
}

function InfoRow({ icon: Icon, label, value, href, external }: InfoRowProps) {
  const content = (
    <div className="flex items-center gap-3 py-2">
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
      {external && <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />}
    </div>
  )

  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="block rounded-md transition-colors hover:bg-muted"
      >
        {content}
      </a>
    )
  }

  return content
}

export function ClubInfo({ info, className }: ClubInfoProps) {
  const hasSocialMedia =
    info.socialMedia?.facebook ||
    info.socialMedia?.instagram ||
    info.socialMedia?.twitter

  const hasContactInfo =
    info.contactEmail || info.contactPhone || info.website

  const hasOrgInfo = info.foundedYear || info.governingBody

  if (!hasContactInfo && !hasSocialMedia && !hasOrgInfo) {
    return null
  }

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Club Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Contact Info */}
        {hasContactInfo && (
          <div className="space-y-1">
            {info.contactEmail && (
              <InfoRow
                icon={Mail}
                label="Email"
                value={info.contactEmail}
                href={`mailto:${info.contactEmail}`}
              />
            )}
            {info.contactPhone && (
              <InfoRow
                icon={Phone}
                label="Phone"
                value={info.contactPhone}
                href={`tel:${info.contactPhone}`}
              />
            )}
            {info.website && (
              <InfoRow
                icon={Globe}
                label="Website"
                value={info.website.replace(/^https?:\/\//, "")}
                href={info.website}
                external
              />
            )}
          </div>
        )}

        {/* Social Media */}
        {hasSocialMedia && (
          <>
            {hasContactInfo && <Separator />}
            <div>
              <p className="mb-2 text-sm font-medium">Social Media</p>
              <div className="flex gap-2">
                {info.socialMedia?.facebook && (
                  <Button
                    variant="outline"
                    size="icon"
                    asChild
                  >
                    <a
                      href={info.socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                    >
                      <Facebook className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {info.socialMedia?.instagram && (
                  <Button
                    variant="outline"
                    size="icon"
                    asChild
                  >
                    <a
                      href={info.socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                    >
                      <Instagram className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {info.socialMedia?.twitter && (
                  <Button
                    variant="outline"
                    size="icon"
                    asChild
                  >
                    <a
                      href={info.socialMedia.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Twitter"
                    >
                      <Twitter className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </>
        )}

        {/* Organization Info */}
        {hasOrgInfo && (
          <>
            {(hasContactInfo || hasSocialMedia) && <Separator />}
            <div className="space-y-1">
              {info.foundedYear && (
                <InfoRow
                  icon={Calendar}
                  label="Founded"
                  value={info.foundedYear.toString()}
                />
              )}
              {info.governingBody && (
                <InfoRow
                  icon={Shield}
                  label="Governing Body"
                  value={info.governingBody}
                />
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

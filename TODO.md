# OctoPals Implementation TODO

> **Tech Stack:** Next.js 14 (App Router), Prisma 6, Neon PostgreSQL, Clerk Auth, Zustand, SWR, TailwindCSS, TypeScript
>
> **Goal:** Launch-ready underwater hockey community platform for desktop & mobile

---

## Phase 1: Project Foundation

### 1.1 Initialize Next.js Project
- [ ] Create Next.js 14 app with TypeScript and App Router
  - Command: `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
- [ ] Configure `tsconfig.json` with strict mode and path aliases
- [ ] Set up `.env.local` with environment variables:
  ```
  DATABASE_URL=postgresql://...
  DATABASE_URL_UNPOOLED=postgresql://...
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
  CLERK_SECRET_KEY=sk_test_...
  NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
  NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
  NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
  NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
  ```

### 1.2 Install Core Dependencies
- [ ] Install Prisma 6 (NOT v7): `npm install prisma@6 @prisma/client@6`
- [ ] Install Clerk: `npm install @clerk/nextjs`
- [ ] Install Zustand: `npm install zustand`
- [ ] Install SWR: `npm install swr`
- [ ] Install UI dependencies:
  ```bash
  npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-tabs @radix-ui/react-avatar @radix-ui/react-select @radix-ui/react-checkbox @radix-ui/react-switch @radix-ui/react-toast @radix-ui/react-popover @radix-ui/react-tooltip
  npm install class-variance-authority clsx tailwind-merge
  npm install lucide-react
  npm install date-fns
  npm install react-hook-form @hookform/resolvers zod
  npm install @tanstack/react-table
  ```
- [ ] Install map dependencies: `npm install react-map-gl mapbox-gl @types/mapbox-gl`
- [ ] Install additional utilities:
  ```bash
  npm install nanoid slugify
  npm install @uploadthing/react uploadthing
  ```

### 1.3 Configure Prisma with Neon
- [ ] Initialize Prisma: `npx prisma init`
- [ ] Configure `prisma/schema.prisma` with Neon connection and `pgbouncer=true`
- [ ] Set generator to use Prisma 6 client

### 1.4 Project Structure Setup
Create the following directory structure:
```
src/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   ├── sign-up/[[...sign-up]]/page.tsx
│   │   └── layout.tsx
│   ├── (marketing)/
│   │   ├── page.tsx (landing)
│   │   ├── about/page.tsx
│   │   ├── pricing/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx
│   │   ├── clubs/
│   │   ├── sessions/
│   │   ├── equipment/
│   │   ├── competitions/
│   │   ├── training/
│   │   ├── messages/
│   │   ├── profile/
│   │   ├── settings/
│   │   └── layout.tsx
│   ├── (club-admin)/
│   │   ├── admin/[clubId]/
│   │   └── layout.tsx
│   ├── api/
│   │   ├── clubs/
│   │   ├── sessions/
│   │   ├── users/
│   │   ├── equipment/
│   │   ├── competitions/
│   │   ├── training/
│   │   ├── messages/
│   │   └── webhooks/
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/ (shadcn-style primitives)
│   ├── clubs/
│   ├── sessions/
│   ├── equipment/
│   ├── training/
│   ├── maps/
│   ├── forms/
│   └── layout/
├── lib/
│   ├── prisma.ts
│   ├── utils.ts
│   ├── validations/
│   └── constants.ts
├── hooks/
│   ├── use-clubs.ts
│   ├── use-sessions.ts
│   ├── use-user.ts
│   └── ...
├── stores/
│   ├── use-app-store.ts
│   ├── use-filter-store.ts
│   └── use-ui-store.ts
├── types/
│   └── index.ts
└── middleware.ts
```

---

## Phase 2: Database Schema

### 2.1 Core User & Auth Models
- [ ] Create `User` model (synced with Clerk)
  ```prisma
  model User {
    id                String   @id @default(cuid())
    clerkId           String   @unique
    email             String   @unique
    username          String?  @unique
    firstName         String?
    lastName          String?
    imageUrl          String?
    bio               String?
    location          String?
    country           String?
    latitude          Float?
    longitude         Float?
    yearsPlaying      Int?
    primaryPosition   Position?
    skillLevel        SkillLevel @default(BEGINNER)
    isPublicProfile   Boolean  @default(true)
    emailNotifications Boolean @default(true)
    pushNotifications  Boolean @default(true)
    subscriptionTier  SubscriptionTier @default(FREE)
    createdAt         DateTime @default(now())
    updatedAt         DateTime @updatedAt

    // Relations
    clubMemberships   ClubMember[]
    sessionRsvps      SessionRsvp[]
    attendances       Attendance[]
    equipmentCheckouts EquipmentCheckout[]
    sentMessages      Message[] @relation("SentMessages")
    receivedMessages  Message[] @relation("ReceivedMessages")
    reviews           Review[]
    badges            UserBadge[]
    trainingLogs      TrainingLog[]
    breathHoldRecords BreathHoldRecord[]
    notifications     Notification[]
    favoriteClubs     FavoriteClub[]
  }
  ```

- [ ] Create enums:
  ```prisma
  enum SkillLevel {
    BEGINNER
    INTERMEDIATE
    ADVANCED
    ELITE
  }

  enum Position {
    FORWARD
    MIDFIELDER
    BACK
    GOALKEEPER
    FLEXIBLE
  }

  enum SubscriptionTier {
    FREE
    PLAYER_PRO
    CLUB_STARTER
    CLUB_PRO
    CLUB_ELITE
  }

  enum ClubRole {
    MEMBER
    COACH
    EQUIPMENT_MANAGER
    TREASURER
    SESSION_COORDINATOR
    ADMIN
    OWNER
  }

  enum SessionType {
    TRAINING
    SCRIMMAGE
    PICKUP
    BEGINNER_INTRO
    COMPETITION_PREP
    SOCIAL
  }

  enum RsvpStatus {
    YES
    NO
    MAYBE
  }

  enum EquipmentType {
    STICK
    GLOVE
    MASK
    SNORKEL
    FINS
    CAP
    PUCK
    GOAL
  }

  enum EquipmentCondition {
    NEW
    GOOD
    FAIR
    POOR
  }

  enum EquipmentSize {
    XS
    S
    M
    L
    XL
    XXL
    JUNIOR
    ADULT
    ONE_SIZE
  }
  ```

### 2.2 Club Models
- [ ] Create `Club` model
  ```prisma
  model Club {
    id              String   @id @default(cuid())
    name            String
    slug            String   @unique
    description     String?
    foundedYear     Int?
    imageUrl        String?
    coverImageUrl   String?
    website         String?
    email           String?
    phone           String?
    facebookUrl     String?
    instagramUrl    String?
    twitterUrl      String?
    governingBody   String?
    isVerified      Boolean  @default(false)
    isActive        Boolean  @default(true)
    welcomesBeginners Boolean @default(true)
    languagesSpoken String[] @default(["English"])
    createdAt       DateTime @default(now())
    updatedAt       DateTime @updatedAt

    // Location
    country         String
    city            String
    address         String?
    latitude        Float
    longitude       Float

    // Relations
    members         ClubMember[]
    venues          Venue[]
    sessions        Session[]
    equipment       Equipment[]
    announcements   Announcement[]
    reviews         Review[]
    favoriteBy      FavoriteClub[]
  }
  ```

- [ ] Create `ClubMember` model (join table with role)
  ```prisma
  model ClubMember {
    id        String   @id @default(cuid())
    userId    String
    clubId    String
    role      ClubRole @default(MEMBER)
    joinedAt  DateTime @default(now())
    isActive  Boolean  @default(true)

    user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
    club      Club     @relation(fields: [clubId], references: [id], onDelete: Cascade)

    @@unique([userId, clubId])
  }
  ```

- [ ] Create `Venue` model (pools)
  ```prisma
  model Venue {
    id              String   @id @default(cuid())
    clubId          String
    name            String
    address         String
    city            String
    country         String
    latitude        Float
    longitude       Float
    poolLength      Float?   // meters
    poolWidth       Float?   // meters
    poolDepth       Float?   // meters
    waterTemp       Float?   // celsius
    hasAccessibility Boolean @default(false)
    notes           String?
    imageUrl        String?
    createdAt       DateTime @default(now())
    updatedAt       DateTime @updatedAt

    club            Club     @relation(fields: [clubId], references: [id], onDelete: Cascade)
    sessions        Session[]
  }
  ```

### 2.3 Session Models
- [ ] Create `Session` model
  ```prisma
  model Session {
    id              String      @id @default(cuid())
    clubId          String
    venueId         String?
    title           String
    description     String?
    type            SessionType @default(TRAINING)
    skillLevel      SkillLevel?
    startTime       DateTime
    endTime         DateTime
    maxAttendees    Int?
    isCancelled     Boolean     @default(false)
    cancelReason    String?
    isRecurring     Boolean     @default(false)
    recurringRule   String?     // iCal RRULE format
    createdById     String
    createdAt       DateTime    @default(now())
    updatedAt       DateTime    @updatedAt

    club            Club        @relation(fields: [clubId], references: [id], onDelete: Cascade)
    venue           Venue?      @relation(fields: [venueId], references: [id])
    rsvps           SessionRsvp[]
    attendances     Attendance[]
  }
  ```

- [ ] Create `SessionRsvp` model
  ```prisma
  model SessionRsvp {
    id          String     @id @default(cuid())
    sessionId   String
    userId      String
    status      RsvpStatus
    note        String?
    createdAt   DateTime   @default(now())
    updatedAt   DateTime   @updatedAt

    session     Session    @relation(fields: [sessionId], references: [id], onDelete: Cascade)
    user        User       @relation(fields: [userId], references: [id], onDelete: Cascade)

    @@unique([sessionId, userId])
  }
  ```

- [ ] Create `Attendance` model
  ```prisma
  model Attendance {
    id          String   @id @default(cuid())
    sessionId   String
    userId      String
    checkedInAt DateTime @default(now())
    checkedInBy String?  // admin who checked them in
    method      String?  // QR, GPS, MANUAL

    session     Session  @relation(fields: [sessionId], references: [id], onDelete: Cascade)
    user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

    @@unique([sessionId, userId])
  }
  ```

### 2.4 Equipment Models
- [ ] Create `Equipment` model
  ```prisma
  model Equipment {
    id            String            @id @default(cuid())
    clubId        String
    type          EquipmentType
    name          String
    description   String?
    size          EquipmentSize?
    condition     EquipmentCondition @default(GOOD)
    purchaseDate  DateTime?
    imageUrl      String?
    serialNumber  String?
    isAvailable   Boolean           @default(true)
    notes         String?
    createdAt     DateTime          @default(now())
    updatedAt     DateTime          @updatedAt

    club          Club              @relation(fields: [clubId], references: [id], onDelete: Cascade)
    checkouts     EquipmentCheckout[]
  }
  ```

- [ ] Create `EquipmentCheckout` model
  ```prisma
  model EquipmentCheckout {
    id              String    @id @default(cuid())
    equipmentId     String
    userId          String
    checkedOutAt    DateTime  @default(now())
    dueDate         DateTime?
    returnedAt      DateTime?
    conditionOut    EquipmentCondition
    conditionIn     EquipmentCondition?
    photoOutUrl     String?
    photoInUrl      String?
    notes           String?
    approvedById    String?

    equipment       Equipment @relation(fields: [equipmentId], references: [id], onDelete: Cascade)
    user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  }
  ```

### 2.5 Competition Models
- [ ] Create `Competition` model
  ```prisma
  model Competition {
    id                String   @id @default(cuid())
    name              String
    description       String?
    organizingBody    String?
    startDate         DateTime
    endDate           DateTime
    registrationDeadline DateTime?
    registrationUrl   String?
    venue             String?
    city              String
    country           String
    latitude          Float?
    longitude         Float?
    skillLevels       SkillLevel[]
    ageGroups         String[]
    imageUrl          String?
    websiteUrl        String?
    isPublished       Boolean  @default(true)
    createdAt         DateTime @default(now())
    updatedAt         DateTime @updatedAt

    followers         CompetitionFollower[]
    results           CompetitionResult[]
  }
  ```

- [ ] Create `CompetitionFollower` model
  ```prisma
  model CompetitionFollower {
    id            String      @id @default(cuid())
    competitionId String
    userId        String
    createdAt     DateTime    @default(now())

    competition   Competition @relation(fields: [competitionId], references: [id], onDelete: Cascade)

    @@unique([competitionId, userId])
  }
  ```

### 2.6 Training & Analytics Models
- [ ] Create `TrainingLog` model
  ```prisma
  model TrainingLog {
    id            String   @id @default(cuid())
    userId        String
    date          DateTime @default(now())
    type          String   // APNEA_DRY, POOL_FITNESS, STICK_WORK, SCRIMMAGE, COMPETITION
    durationMins  Int
    intensity     Int?     // 1-10
    notes         String?
    createdAt     DateTime @default(now())

    user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  }
  ```

- [ ] Create `BreathHoldRecord` model
  ```prisma
  model BreathHoldRecord {
    id              String   @id @default(cuid())
    userId          String
    date            DateTime @default(now())
    durationSeconds Int
    type            String   // STATIC, CO2_TABLE, O2_TABLE
    tableRound      Int?     // which round in table training
    restSeconds     Int?
    heartRateBefore Int?
    heartRateAfter  Int?
    difficulty      Int?     // 1-10 perceived difficulty
    notes           String?
    createdAt       DateTime @default(now())

    user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  }
  ```

### 2.7 Social & Communication Models
- [ ] Create `Message` model
  ```prisma
  model Message {
    id          String   @id @default(cuid())
    senderId    String
    receiverId  String?  // null for club announcements
    clubId      String?  // for club messages
    content     String
    isRead      Boolean  @default(false)
    createdAt   DateTime @default(now())

    sender      User     @relation("SentMessages", fields: [senderId], references: [id], onDelete: Cascade)
    receiver    User?    @relation("ReceivedMessages", fields: [receiverId], references: [id], onDelete: Cascade)
  }
  ```

- [ ] Create `Review` model
  ```prisma
  model Review {
    id        String   @id @default(cuid())
    userId    String
    clubId    String
    rating    Int      // 1-5
    content   String?
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt

    user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
    club      Club     @relation(fields: [clubId], references: [id], onDelete: Cascade)

    @@unique([userId, clubId])
  }
  ```

- [ ] Create `Notification` model
  ```prisma
  model Notification {
    id        String   @id @default(cuid())
    userId    String
    type      String   // SESSION_REMINDER, RSVP_UPDATE, MESSAGE, etc.
    title     String
    body      String
    linkUrl   String?
    isRead    Boolean  @default(false)
    createdAt DateTime @default(now())

    user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  }
  ```

- [ ] Create `Badge` and `UserBadge` models
  ```prisma
  model Badge {
    id          String      @id @default(cuid())
    name        String      @unique
    description String
    imageUrl    String?
    category    String      // ATTENDANCE, COMMUNITY, PERFORMANCE
    requirement String      // JSON description of how to earn

    users       UserBadge[]
  }

  model UserBadge {
    id        String   @id @default(cuid())
    userId    String
    badgeId   String
    earnedAt  DateTime @default(now())

    user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
    badge     Badge    @relation(fields: [badgeId], references: [id], onDelete: Cascade)

    @@unique([userId, badgeId])
  }
  ```

- [ ] Create `FavoriteClub` model
  ```prisma
  model FavoriteClub {
    id        String   @id @default(cuid())
    userId    String
    clubId    String
    createdAt DateTime @default(now())

    user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
    club      Club     @relation(fields: [clubId], references: [id], onDelete: Cascade)

    @@unique([userId, clubId])
  }
  ```

- [ ] Create `Announcement` model
  ```prisma
  model Announcement {
    id        String   @id @default(cuid())
    clubId    String
    title     String
    content   String
    isPinned  Boolean  @default(false)
    createdById String
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt

    club      Club     @relation(fields: [clubId], references: [id], onDelete: Cascade)
  }
  ```

### 2.8 Run Migrations
- [ ] Generate Prisma client: `npx prisma generate`
- [ ] Create initial migration: `npx prisma migrate dev --name init`
- [ ] Verify database connection and tables created

---

## Phase 3: Authentication & Middleware

### 3.1 Clerk Setup
- [ ] Create `src/middleware.ts` with Clerk auth
  ```typescript
  import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

  const isPublicRoute = createRouteMatcher([
    '/',
    '/about',
    '/pricing',
    '/clubs(.*)',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/webhooks(.*)',
  ])

  export default clerkMiddleware(async (auth, req) => {
    if (!isPublicRoute(req)) {
      await auth.protect()
    }
  })

  export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
  }
  ```

- [ ] Create `src/app/(auth)/sign-in/[[...sign-in]]/page.tsx`
- [ ] Create `src/app/(auth)/sign-up/[[...sign-up]]/page.tsx`
- [ ] Create `src/app/(auth)/layout.tsx` with centered auth layout

### 3.2 Clerk Webhook for User Sync
- [ ] Create `src/app/api/webhooks/clerk/route.ts`
  - Handle `user.created` event - create User in database
  - Handle `user.updated` event - update User in database
  - Handle `user.deleted` event - delete User in database
  - Verify webhook signature using Svix

### 3.3 Auth Utilities
- [ ] Create `src/lib/auth.ts` with helper functions:
  - `getCurrentUser()` - get current user from Clerk + database
  - `requireAuth()` - throw if not authenticated
  - `requireClubAdmin(clubId)` - verify user is admin of club
  - `requireClubMember(clubId)` - verify user is member of club

---

## Phase 4: Core Infrastructure

### 4.1 Prisma Client Setup
- [ ] Create `src/lib/prisma.ts` with connection pooling for serverless

### 4.2 Zustand Stores
- [ ] Create `src/stores/use-app-store.ts`
  ```typescript
  // Global app state
  - currentLocation: { lat, lng } | null
  - isLocating: boolean
  - setLocation()
  - detectLocation()
  ```

- [ ] Create `src/stores/use-filter-store.ts`
  ```typescript
  // Club/session filter state
  - skillLevel: SkillLevel | null
  - distance: number // km radius
  - sessionDays: string[]
  - hasEquipment: boolean
  - welcomesBeginners: boolean
  - setFilter()
  - resetFilters()
  ```

- [ ] Create `src/stores/use-ui-store.ts`
  ```typescript
  // UI state
  - sidebarOpen: boolean
  - mobileMenuOpen: boolean
  - activeModal: string | null
  - toggleSidebar()
  - openModal()
  - closeModal()
  ```

### 4.3 SWR Configuration
- [ ] Create `src/lib/swr-config.tsx` with SWRConfig provider
- [ ] Create `src/lib/fetcher.ts` for SWR fetcher function

### 4.4 SWR Hooks
- [ ] Create `src/hooks/use-clubs.ts`
  ```typescript
  - useClubs(filters) - list clubs with filters
  - useClub(id) - single club
  - useClubMembers(clubId)
  - useNearbyClubs(lat, lng, radiusKm)
  ```

- [ ] Create `src/hooks/use-sessions.ts`
  ```typescript
  - useSessions(filters)
  - useSession(id)
  - useUpcomingSessions(clubId?)
  - useMyRsvps()
  ```

- [ ] Create `src/hooks/use-user.ts`
  ```typescript
  - useCurrentUser()
  - useUserProfile(id)
  - useUserStats(id)
  - useUserClubs()
  ```

- [ ] Create `src/hooks/use-equipment.ts`
- [ ] Create `src/hooks/use-competitions.ts`
- [ ] Create `src/hooks/use-training.ts`
- [ ] Create `src/hooks/use-messages.ts`
- [ ] Create `src/hooks/use-notifications.ts`

### 4.5 Form Validation Schemas (Zod)
- [ ] Create `src/lib/validations/club.ts`
- [ ] Create `src/lib/validations/session.ts`
- [ ] Create `src/lib/validations/user.ts`
- [ ] Create `src/lib/validations/equipment.ts`
- [ ] Create `src/lib/validations/training.ts`

### 4.6 Utility Functions
- [ ] Create `src/lib/utils.ts` with:
  - `cn()` - classname merge utility
  - `formatDate()`, `formatTime()`, `formatDateTime()`
  - `formatDistance()` - "5 km away"
  - `getInitials()` - for avatars
  - `slugify()` - for URLs
- [ ] Create `src/lib/constants.ts` with app constants
- [ ] Create `src/lib/geo.ts` with geolocation utilities:
  - `calculateDistance(lat1, lng1, lat2, lng2)`
  - `getBoundingBox(lat, lng, radiusKm)`

---

## Phase 5: UI Components

### 5.1 Base UI Components (shadcn-style)
- [ ] Create `src/components/ui/button.tsx`
- [ ] Create `src/components/ui/input.tsx`
- [ ] Create `src/components/ui/textarea.tsx`
- [ ] Create `src/components/ui/select.tsx`
- [ ] Create `src/components/ui/checkbox.tsx`
- [ ] Create `src/components/ui/switch.tsx`
- [ ] Create `src/components/ui/dialog.tsx`
- [ ] Create `src/components/ui/dropdown-menu.tsx`
- [ ] Create `src/components/ui/tabs.tsx`
- [ ] Create `src/components/ui/card.tsx`
- [ ] Create `src/components/ui/badge.tsx`
- [ ] Create `src/components/ui/avatar.tsx`
- [ ] Create `src/components/ui/toast.tsx` + `use-toast.ts`
- [ ] Create `src/components/ui/skeleton.tsx`
- [ ] Create `src/components/ui/spinner.tsx`
- [ ] Create `src/components/ui/empty-state.tsx`
- [ ] Create `src/components/ui/error-state.tsx`
- [ ] Create `src/components/ui/popover.tsx`
- [ ] Create `src/components/ui/tooltip.tsx`
- [ ] Create `src/components/ui/calendar.tsx`
- [ ] Create `src/components/ui/date-picker.tsx`
- [ ] Create `src/components/ui/time-picker.tsx`
- [ ] Create `src/components/ui/data-table.tsx`
- [ ] Create `src/components/ui/pagination.tsx`

### 5.2 Layout Components
- [ ] Create `src/components/layout/header.tsx` - main navigation header
- [ ] Create `src/components/layout/mobile-nav.tsx` - mobile bottom navigation
- [ ] Create `src/components/layout/sidebar.tsx` - dashboard sidebar
- [ ] Create `src/components/layout/footer.tsx`
- [ ] Create `src/components/layout/page-header.tsx` - page title + breadcrumbs
- [ ] Create `src/components/layout/container.tsx`
- [ ] Create `src/components/layout/dashboard-shell.tsx`

### 5.3 Club Components
- [ ] Create `src/components/clubs/club-card.tsx` - card for club listings
- [ ] Create `src/components/clubs/club-list.tsx` - list of club cards
- [ ] Create `src/components/clubs/club-header.tsx` - club page header with image
- [ ] Create `src/components/clubs/club-stats.tsx` - member count, rating, etc.
- [ ] Create `src/components/clubs/club-info.tsx` - contact, social links
- [ ] Create `src/components/clubs/club-reviews.tsx` - reviews section
- [ ] Create `src/components/clubs/club-sessions.tsx` - upcoming sessions list
- [ ] Create `src/components/clubs/club-members.tsx` - member list
- [ ] Create `src/components/clubs/join-club-button.tsx`
- [ ] Create `src/components/clubs/favorite-club-button.tsx`
- [ ] Create `src/components/clubs/club-filters.tsx` - filter sidebar/drawer

### 5.4 Map Components
- [ ] Create `src/components/maps/club-map.tsx` - main interactive map
- [ ] Create `src/components/maps/club-marker.tsx` - custom map marker
- [ ] Create `src/components/maps/club-popup.tsx` - marker popup
- [ ] Create `src/components/maps/location-search.tsx` - search input with autocomplete
- [ ] Create `src/components/maps/user-location-button.tsx` - "Use my location" button
- [ ] Create `src/components/maps/map-controls.tsx` - zoom, style controls

### 5.5 Session Components
- [ ] Create `src/components/sessions/session-card.tsx`
- [ ] Create `src/components/sessions/session-list.tsx`
- [ ] Create `src/components/sessions/session-calendar.tsx` - month/week view
- [ ] Create `src/components/sessions/session-details.tsx`
- [ ] Create `src/components/sessions/rsvp-button.tsx`
- [ ] Create `src/components/sessions/rsvp-list.tsx` - who's coming
- [ ] Create `src/components/sessions/create-session-form.tsx`
- [ ] Create `src/components/sessions/session-type-badge.tsx`

### 5.6 Equipment Components
- [ ] Create `src/components/equipment/equipment-card.tsx`
- [ ] Create `src/components/equipment/equipment-list.tsx`
- [ ] Create `src/components/equipment/equipment-filters.tsx`
- [ ] Create `src/components/equipment/checkout-button.tsx`
- [ ] Create `src/components/equipment/checkout-form.tsx`
- [ ] Create `src/components/equipment/return-form.tsx`
- [ ] Create `src/components/equipment/equipment-form.tsx` - add/edit
- [ ] Create `src/components/equipment/condition-badge.tsx`

### 5.7 Training Components
- [ ] Create `src/components/training/breath-hold-timer.tsx` - main timer UI
- [ ] Create `src/components/training/apnea-table.tsx` - CO2/O2 table display
- [ ] Create `src/components/training/training-log-form.tsx`
- [ ] Create `src/components/training/training-history.tsx`
- [ ] Create `src/components/training/progress-chart.tsx`
- [ ] Create `src/components/training/personal-best-card.tsx`
- [ ] Create `src/components/training/stats-overview.tsx`

### 5.8 User/Profile Components
- [ ] Create `src/components/user/user-avatar.tsx`
- [ ] Create `src/components/user/user-card.tsx`
- [ ] Create `src/components/user/profile-header.tsx`
- [ ] Create `src/components/user/profile-stats.tsx`
- [ ] Create `src/components/user/profile-badges.tsx`
- [ ] Create `src/components/user/profile-form.tsx`
- [ ] Create `src/components/user/skill-level-selector.tsx`

### 5.9 Message Components
- [ ] Create `src/components/messages/conversation-list.tsx`
- [ ] Create `src/components/messages/message-thread.tsx`
- [ ] Create `src/components/messages/message-input.tsx`
- [ ] Create `src/components/messages/message-bubble.tsx`

### 5.10 Competition Components
- [ ] Create `src/components/competitions/competition-card.tsx`
- [ ] Create `src/components/competitions/competition-list.tsx`
- [ ] Create `src/components/competitions/competition-calendar.tsx`
- [ ] Create `src/components/competitions/competition-filters.tsx`
- [ ] Create `src/components/competitions/follow-button.tsx`

### 5.11 Notification Components
- [ ] Create `src/components/notifications/notification-bell.tsx`
- [ ] Create `src/components/notifications/notification-list.tsx`
- [ ] Create `src/components/notifications/notification-item.tsx`

### 5.12 Form Components
- [ ] Create `src/components/forms/form-field.tsx` - wrapper with label/error
- [ ] Create `src/components/forms/image-upload.tsx`
- [ ] Create `src/components/forms/location-picker.tsx`
- [ ] Create `src/components/forms/multi-select.tsx`
- [ ] Create `src/components/forms/search-input.tsx`

---

## Phase 6: API Routes

### 6.1 Club API Routes
- [ ] `GET /api/clubs` - list clubs with filters, pagination, geospatial search
- [ ] `GET /api/clubs/[id]` - get single club with relations
- [ ] `POST /api/clubs` - create club (requires auth)
- [ ] `PATCH /api/clubs/[id]` - update club (requires admin)
- [ ] `DELETE /api/clubs/[id]` - delete club (requires owner)
- [ ] `GET /api/clubs/[id]/members` - list club members
- [ ] `POST /api/clubs/[id]/join` - request to join club
- [ ] `DELETE /api/clubs/[id]/leave` - leave club
- [ ] `GET /api/clubs/[id]/sessions` - list club sessions
- [ ] `GET /api/clubs/nearby` - geospatial search for nearby clubs

### 6.2 Session API Routes
- [ ] `GET /api/sessions` - list sessions with filters
- [ ] `GET /api/sessions/[id]` - get single session
- [ ] `POST /api/sessions` - create session (requires club admin)
- [ ] `PATCH /api/sessions/[id]` - update session
- [ ] `DELETE /api/sessions/[id]` - delete/cancel session
- [ ] `POST /api/sessions/[id]/rsvp` - RSVP to session
- [ ] `DELETE /api/sessions/[id]/rsvp` - cancel RSVP
- [ ] `GET /api/sessions/[id]/rsvps` - list RSVPs
- [ ] `POST /api/sessions/[id]/checkin` - check in to session
- [ ] `GET /api/sessions/upcoming` - user's upcoming sessions

### 6.3 User API Routes
- [ ] `GET /api/users/me` - get current user profile
- [ ] `PATCH /api/users/me` - update current user profile
- [ ] `GET /api/users/[id]` - get public user profile
- [ ] `GET /api/users/me/clubs` - list user's clubs
- [ ] `GET /api/users/me/stats` - get user statistics
- [ ] `GET /api/users/me/badges` - get user badges

### 6.4 Equipment API Routes
- [ ] `GET /api/clubs/[id]/equipment` - list club equipment
- [ ] `POST /api/clubs/[id]/equipment` - add equipment (admin)
- [ ] `PATCH /api/equipment/[id]` - update equipment
- [ ] `DELETE /api/equipment/[id]` - delete equipment
- [ ] `POST /api/equipment/[id]/checkout` - request checkout
- [ ] `POST /api/equipment/[id]/return` - return equipment
- [ ] `GET /api/equipment/[id]/history` - checkout history

### 6.5 Competition API Routes
- [ ] `GET /api/competitions` - list competitions with filters
- [ ] `GET /api/competitions/[id]` - get single competition
- [ ] `POST /api/competitions/[id]/follow` - follow competition
- [ ] `DELETE /api/competitions/[id]/follow` - unfollow

### 6.6 Training API Routes
- [ ] `GET /api/training/logs` - get user's training logs
- [ ] `POST /api/training/logs` - create training log
- [ ] `GET /api/training/breath-holds` - get breath hold records
- [ ] `POST /api/training/breath-holds` - record breath hold
- [ ] `GET /api/training/stats` - get training statistics
- [ ] `GET /api/training/personal-bests` - get personal bests

### 6.7 Message API Routes
- [ ] `GET /api/messages` - get user's conversations
- [ ] `GET /api/messages/[conversationId]` - get messages in conversation
- [ ] `POST /api/messages` - send message
- [ ] `PATCH /api/messages/[id]/read` - mark as read

### 6.8 Notification API Routes
- [ ] `GET /api/notifications` - get user's notifications
- [ ] `PATCH /api/notifications/[id]/read` - mark as read
- [ ] `POST /api/notifications/read-all` - mark all as read

### 6.9 Review API Routes
- [ ] `GET /api/clubs/[id]/reviews` - get club reviews
- [ ] `POST /api/clubs/[id]/reviews` - create review
- [ ] `PATCH /api/reviews/[id]` - update review
- [ ] `DELETE /api/reviews/[id]` - delete review

### 6.10 Favorites API Routes
- [ ] `GET /api/favorites/clubs` - get favorited clubs
- [ ] `POST /api/favorites/clubs/[id]` - add favorite
- [ ] `DELETE /api/favorites/clubs/[id]` - remove favorite

---

## Phase 7: Pages

### 7.1 Marketing Pages (Public)
- [ ] Create `src/app/(marketing)/page.tsx` - Landing page
  - Hero with tagline and CTA
  - Feature highlights (club finder, sessions, training)
  - How it works section
  - Testimonials/community stats
  - Pricing preview
  - Final CTA

- [ ] Create `src/app/(marketing)/about/page.tsx`
  - Mission and vision
  - Team section
  - Story of underwater hockey
  - Contact information

- [ ] Create `src/app/(marketing)/pricing/page.tsx`
  - Pricing tiers comparison table
  - Feature breakdown
  - FAQ section

- [ ] Create `src/app/(marketing)/layout.tsx`
  - Marketing header with nav
  - Footer

### 7.2 Club Pages (Public + Auth)
- [ ] Create `src/app/(marketing)/clubs/page.tsx` - Club explorer
  - Split view: map + list
  - Search bar with location autocomplete
  - Filter sidebar/drawer
  - Infinite scroll list

- [ ] Create `src/app/(marketing)/clubs/[slug]/page.tsx` - Club detail
  - Club header with cover image
  - Tabs: About, Sessions, Members, Reviews
  - Sidebar with contact info, stats
  - Join button

### 7.3 Dashboard Pages (Auth Required)
- [ ] Create `src/app/(dashboard)/dashboard/page.tsx` - Main dashboard
  - Welcome message with name
  - Upcoming sessions (next 7 days)
  - Your clubs quick access
  - Recent activity feed
  - Quick actions (find club, log training)

- [ ] Create `src/app/(dashboard)/layout.tsx`
  - Sidebar navigation
  - Header with notifications, profile
  - Mobile bottom nav

### 7.4 Session Pages
- [ ] Create `src/app/(dashboard)/sessions/page.tsx` - Sessions list
  - Calendar view toggle (month/week/list)
  - Filter by club, type
  - My RSVPs section

- [ ] Create `src/app/(dashboard)/sessions/[id]/page.tsx` - Session detail
  - Session info
  - RSVP button + status
  - Attendee list
  - Club info link
  - Directions button

### 7.5 Equipment Pages
- [ ] Create `src/app/(dashboard)/equipment/page.tsx` - Equipment browser
  - Available equipment list
  - My checkouts section
  - Filter by type, size

- [ ] Create `src/app/(dashboard)/equipment/[id]/page.tsx` - Equipment detail
  - Equipment info + photos
  - Checkout button
  - Availability calendar

### 7.6 Competition Pages
- [ ] Create `src/app/(dashboard)/competitions/page.tsx` - Competition calendar
  - Calendar view
  - List view with filters
  - Following tab

- [ ] Create `src/app/(dashboard)/competitions/[id]/page.tsx` - Competition detail
  - Competition info
  - Registration link
  - Follow button
  - Travel coordination

### 7.7 Training Pages
- [ ] Create `src/app/(dashboard)/training/page.tsx` - Training hub
  - Quick stats overview
  - Recent logs
  - Personal bests
  - Quick log button

- [ ] Create `src/app/(dashboard)/training/breath-hold/page.tsx` - Breath hold trainer
  - Timer interface
  - Table selection (CO2, O2, custom)
  - Session history

- [ ] Create `src/app/(dashboard)/training/log/page.tsx` - Training log
  - Log form
  - Calendar view of logs
  - Filter by type

- [ ] Create `src/app/(dashboard)/training/progress/page.tsx` - Progress analytics
  - Charts and graphs
  - Period comparisons
  - Personal bests list

### 7.8 Message Pages
- [ ] Create `src/app/(dashboard)/messages/page.tsx` - Messages
  - Conversation list
  - New message button

- [ ] Create `src/app/(dashboard)/messages/[conversationId]/page.tsx` - Conversation
  - Message thread
  - Input area
  - Back button

### 7.9 Profile Pages
- [ ] Create `src/app/(dashboard)/profile/page.tsx` - Own profile
  - Profile header with edit button
  - Stats and badges
  - Clubs list
  - Recent activity

- [ ] Create `src/app/(dashboard)/profile/[id]/page.tsx` - Other user profile
  - Public profile view
  - Message button

- [ ] Create `src/app/(dashboard)/profile/edit/page.tsx` - Edit profile
  - Profile form
  - Avatar upload
  - Privacy settings

### 7.10 Settings Pages
- [ ] Create `src/app/(dashboard)/settings/page.tsx` - Settings hub
  - Account settings
  - Notification preferences
  - Privacy settings
  - Subscription management

### 7.11 Club Admin Pages
- [ ] Create `src/app/(club-admin)/admin/[clubId]/page.tsx` - Admin dashboard
  - Club stats overview
  - Recent activity
  - Quick actions

- [ ] Create `src/app/(club-admin)/admin/[clubId]/members/page.tsx` - Member management
  - Member table with roles
  - Invite member
  - Manage roles

- [ ] Create `src/app/(club-admin)/admin/[clubId]/sessions/page.tsx` - Session management
  - Session list with edit/delete
  - Create session
  - Attendance reports

- [ ] Create `src/app/(club-admin)/admin/[clubId]/equipment/page.tsx` - Equipment management
  - Equipment inventory table
  - Add equipment
  - Checkout history

- [ ] Create `src/app/(club-admin)/admin/[clubId]/settings/page.tsx` - Club settings
  - Club info form
  - Venue management
  - Danger zone (transfer/delete)

### 7.12 Onboarding
- [ ] Create `src/app/(dashboard)/onboarding/page.tsx` - New user onboarding
  - Step 1: Basic info (name, location)
  - Step 2: Experience level
  - Step 3: Find clubs near you
  - Step 4: Profile photo (optional)
  - Completion celebration

---

## Phase 8: Feature Implementation

### 8.1 Club Finder Feature
- [ ] Implement map with Mapbox GL
  - Display club markers
  - Cluster nearby clubs
  - Custom marker styling by verification status
  - Popup on click
- [ ] Implement geolocation
  - Browser geolocation API
  - Permission handling
  - Fallback to IP geolocation
- [ ] Implement search
  - Location autocomplete (Mapbox Geocoding)
  - Club name search
  - Combined search
- [ ] Implement filters
  - Skill level filter
  - Distance radius slider
  - Session days checkboxes
  - Beginner-friendly toggle
- [ ] Implement infinite scroll list
- [ ] Implement favorite clubs

### 8.2 Session Scheduling Feature
- [ ] Implement session calendar views
  - Month view with dots
  - Week view with time slots
  - List view
- [ ] Implement RSVP system
  - Yes/No/Maybe options
  - Optimistic updates
  - Notification on change
- [ ] Implement attendance tracking
  - QR code generation for admins
  - QR scanner for check-in
  - Manual check-in fallback
- [ ] Implement session creation (admin)
  - Form with validation
  - Recurring session options
  - Venue selection
- [ ] Implement reminders
  - Create notification 24h before
  - Create notification 2h before

### 8.3 Equipment Management Feature
- [ ] Implement equipment inventory
  - CRUD operations
  - Bulk import
  - Photo upload
- [ ] Implement checkout flow
  - Request checkout
  - Admin approval (optional)
  - Return with condition report
- [ ] Implement availability display
- [ ] Implement checkout history

### 8.4 Training Analytics Feature
- [ ] Implement breath hold timer
  - Countdown/count-up timer
  - Audio cues (if supported)
  - Vibration cues (mobile)
  - Pause/resume
- [ ] Implement CO2/O2 tables
  - Table generation based on PB
  - Round-by-round guidance
  - Auto-advance between rounds
- [ ] Implement training log
  - Log entry form
  - Calendar view
  - Edit/delete
- [ ] Implement progress charts
  - Line charts for trends
  - Personal best highlights
  - Period comparisons

### 8.5 Competition Calendar Feature
- [ ] Implement competition listing
  - Calendar view
  - Filter by region, level
  - Sort by date
- [ ] Implement follow system
  - Follow/unfollow
  - Create reminders for registration deadline
- [ ] Implement competition detail page

### 8.6 Messaging Feature
- [ ] Implement conversation list
  - Sorted by recent
  - Unread indicators
- [ ] Implement message thread
  - Real-time updates (polling or websockets)
  - Scroll to bottom
  - Load more history
- [ ] Implement send message
  - Text input
  - Send button
  - Optimistic update

### 8.7 Notification System
- [ ] Implement notification bell with count
- [ ] Implement notification dropdown/page
- [ ] Implement mark as read
- [ ] Implement notification creation for:
  - Session reminders
  - RSVP updates
  - New messages
  - Club announcements

### 8.8 Review System
- [ ] Implement club reviews
  - Star rating (1-5)
  - Written review
  - Verified attendance badge
- [ ] Implement review listing
- [ ] Implement edit/delete own review

### 8.9 Badge System
- [ ] Create seed data for badges
- [ ] Implement badge checking logic
- [ ] Implement badge display on profile
- [ ] Implement badge earned notification

---

## Phase 9: Mobile Optimization

### 9.1 Responsive Design
- [ ] Ensure all pages are mobile-responsive
- [ ] Implement mobile navigation (bottom tabs)
- [ ] Implement swipe gestures where appropriate
- [ ] Test on various screen sizes

### 9.2 PWA Setup
- [ ] Create `public/manifest.json`
- [ ] Create app icons (various sizes)
- [ ] Implement service worker for offline support
- [ ] Add "Add to Home Screen" prompt

### 9.3 Touch Optimization
- [ ] Ensure tap targets are minimum 44x44px
- [ ] Implement pull-to-refresh where appropriate
- [ ] Optimize forms for mobile input

---

## Phase 10: Testing & Quality

### 10.1 Testing Setup
- [ ] Install testing dependencies: `npm install -D vitest @testing-library/react @testing-library/jest-dom`
- [ ] Configure Vitest
- [ ] Create test utilities

### 10.2 Unit Tests
- [ ] Test utility functions
- [ ] Test Zustand stores
- [ ] Test form validation schemas

### 10.3 Component Tests
- [ ] Test key UI components
- [ ] Test form components
- [ ] Test interactive components

### 10.4 API Tests
- [ ] Test API routes with mock data
- [ ] Test authentication flows
- [ ] Test error handling

### 10.5 E2E Tests (Optional)
- [ ] Set up Playwright
- [ ] Test critical user flows:
  - Sign up → Onboarding → Find club → RSVP
  - Log training → View progress
  - Admin: Create session

---

## Phase 11: Seed Data & Launch Prep

### 11.1 Seed Data
- [ ] Create `prisma/seed.ts`
- [ ] Seed initial badges
- [ ] Seed sample clubs (real UWH clubs from UWHMap)
- [ ] Seed sample competitions
- [ ] Run seed: `npx prisma db seed`

### 11.2 Error Handling
- [ ] Create `src/app/error.tsx` global error boundary
- [ ] Create `src/app/not-found.tsx` 404 page
- [ ] Implement error logging (optional: Sentry)

### 11.3 SEO & Meta
- [ ] Create `src/app/layout.tsx` with default metadata
- [ ] Add dynamic metadata to key pages
- [ ] Create `src/app/sitemap.ts`
- [ ] Create `src/app/robots.ts`
- [ ] Add Open Graph images

### 11.4 Performance
- [ ] Implement image optimization with next/image
- [ ] Add loading states to all data-dependent components
- [ ] Implement Suspense boundaries
- [ ] Optimize bundle size

### 11.5 Analytics
- [ ] Set up Vercel Analytics (optional)
- [ ] Implement event tracking for key actions

---

## Phase 12: Deployment

### 12.1 Vercel Configuration
- [ ] Create `vercel.json` if needed
- [ ] Configure environment variables in Vercel dashboard
- [ ] Set up production database connection

### 12.2 Final Checks
- [ ] Run `npm run build` and fix any errors
- [ ] Run `npm run lint` and fix any issues
- [ ] Test all pages locally in production mode
- [ ] Verify database migrations are up to date

### 12.3 Deploy
- [ ] Push to GitHub
- [ ] Deploy to Vercel
- [ ] Verify production deployment
- [ ] Test critical flows in production

### 12.4 Post-Launch
- [ ] Monitor for errors
- [ ] Gather user feedback
- [ ] Plan iteration based on feedback

---

## File Checklist Summary

### Config Files
- [ ] `.env.local`
- [ ] `next.config.js`
- [ ] `tailwind.config.ts`
- [ ] `tsconfig.json`
- [ ] `prisma/schema.prisma`
- [ ] `.eslintrc.json`
- [ ] `package.json`

### Total Files to Create
- **UI Components:** ~50 files
- **Pages:** ~30 files
- **API Routes:** ~40 files
- **Hooks:** ~10 files
- **Stores:** ~3 files
- **Utilities:** ~10 files
- **Validations:** ~5 files
- **Types:** ~3 files

**Estimated Total:** ~150+ files

---

## Quick Start Commands

```bash
# Install dependencies
npm install

# Set up database
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed

# Run development server
npm run dev

# Build for production
npm run build

# Run production locally
npm run start
```

---

*Last Updated: Phase completion tracking will be updated as work progresses*

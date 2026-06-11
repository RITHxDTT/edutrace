# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project Overview

EduTrace is a Learning Management System (LMS) UI for KSHRD. It provides communication rooms (WebRTC/PeerJS), assessment management, calendar, reports with AI insights, and PDF export via Puppeteer. The backend API is external — this repo is frontend-only.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

No test runner is configured. Docker: `docker compose up` (exposes port 3000).

**Custom server**: `src/app/server.ts` implements a Socket.IO server layered on top of Next.js. Run it with `npx ts-node src/app/server.ts` (or compiled) instead of `npm run start` when Socket.IO room signaling is needed. `npm run dev` uses the standard Next.js dev server without Socket.IO.

## Environment Variables

Required in `.env`:
- `NEXT_PUBLIC_API_BASE_URL` — backend API base URL (e.g. `https://api.yannvanneth.dev/api/v1`)
- `NEXTAUTH_URL` — app URL (e.g. `http://localhost:3000`)
- `AUTH_SECRET` — NextAuth secret key

## Architecture

**Next.js 16 App Router** with React 19. Uses `src/` directory with `@/*` path alias.

### Route Groups

- `(landing)` — public marketing/landing page at `/`
- `(auth)` — login, register, OTP verification, forgot-password flows
- `(main)` — authenticated app: dashboard, assessment, calendar, report, profile

### Authentication

- **NextAuth v5 (beta)** with credentials provider (`src/auth.ts`)
- Middleware in `src/proxy.ts` protects `(main)` routes, redirects authenticated users away from auth pages
- JWT strategy with automatic token refresh via `/auth/refresh` endpoint
- Server actions in `src/actions/auth.action.ts` handle login/register/OTP/password-reset
- `src/lib/headerToken.ts` — helper to get auth headers for server-side API calls

### Layout Structure

- Root layout (`src/app/layout.tsx`) — Fredoka font, HeroUIProvider
- `(main)/layout.tsx` — sidebar + top navbar shell, background image overlay, wraps children in `SessionProvider` > `SidebarProvider` > `NavbarProvider`
- `(auth)/layout.tsx` — split layout with logo + right-side cover image, uses `sileo` Toaster

### State Management

- **Zustand** stores:
  - `useNotificationStore` — notification badge/list state
  - `useMeetingRoomStore` (`src/stores/useMeetingRoomStore.ts`) — communication room UI state (panels open/closed, mic/cam/screen/hand state, participant count, unread message count)
- **React Context** for navbar state (`NavbarContext`)
- **react-hook-form** + **Zod** for form validation (schemas in `src/schemas/`)

## UI Component System

Three UI layers coexist — use the right one:

1. **shadcn/ui** (`src/components/ui/`) — base-nova style, Tailwind CSS v4, used for sidebar, sheet, popover, tooltip, skeleton. Add new components via `npx shadcn@latest add <component>`.
2. **HeroUI** (`@heroui/*`) — Input, Select, DatePicker, Tabs, Table, Skeleton, Breadcrumbs. Integrated via `@plugin '../lib/hero.ts'` in globals.css and `HeroUIProvider` in root layout.
3. **Custom "Primary" wrappers** (`src/components/`) — `PrimaryButton` (CVA variants), `PrimaryInput`, `PrimarySelect`, `PrimaryDateField`, `PrimaryTabs` (Tailwind Variants). These wrap HeroUI or base-ui with project-specific styling. Prefer these over raw HeroUI components.

### Icons

- **iconsax-react** — primary icon library, used as `Icon` type in component props
- **lucide-react** — secondary, used in shadcn/ui components

### Notable Third-Party Libraries

- **@dayflow/react** — calendar UI on the `/calendar` page
- **@mui/x-charts** — charts in reports (BarChart, DonutChart)
- **@tiptap/react** — rich text editor
- **framer-motion** — animations
- **sileo** — toast notifications in auth flows

## Design Tokens & Styling

**Tailwind CSS v4** with PostCSS (`@tailwindcss/postcss`). All custom tokens defined in `src/styles/globals.css` under `@theme`:

### Color Palette

| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#35b9ec` | Brand/action color |
| `--color-menta` | `#2E25C9` | Active tab indicator |
| `--color-input-field` | `#F2F6FC` | Input/select backgrounds |
| `--color-accent-ice` | `#F1FDFF` | Light accent surfaces |
| `--color-accent-sand` | `#FFF7E2` | Warm accent surfaces |
| `--color-accent-lavender` | `#EDEAFF` | Purple-tinted surfaces |
| `--color-light-lavendar` | `#EEEFFF` | Active tab background |
| `--color-red` | `#e62020` | Error/destructive |
| `--background-color-bgapp` | `#F4F7FE` | Main app background |
| `--background-color-purple` | `#241cab` | Deep purple (gradients) |
| `--background-color-accent-purple` | `#5d53f9` | Accent purple (gradients) |

### Key Gradients

- `bg-linear-purple` / `--background-image-linear-purple` — purple gradient used on primary buttons
- `text-linear-main` — gradient text utility class (defined in globals.css)

### Typography

- **Fredoka** — single font family for the entire app, loaded via `next/font/google`, set as `--font-sans` and `--font-heading`
- Text colors: `--text-color-primary` (#000), `--text-color-strong` (#3A3A3A), `--text-color-muted` (#B3B4C0), `--text-color-tertiary` (#999DCB), `--text-color-label` (#374151)

### Spacing & Radius

- Inputs/selects: `h-[50px]`, `rounded-[8px]`, `px-[18px]`
- Base radius: `0.625rem` with scaled variants (sm through 4xl)
- Button sizes: xs (`px-[12px] py-[6px]`), sm, md, lg

## Backend API Integration

The backend is a Spring Boot (Java) app at `NEXT_PUBLIC_API_BASE_URL`. All endpoints require `Bearer` token auth. API responses follow: `{ success, message, payload }`.

### Assessment API (`/api/v1/assessments`)

- `GET /` — list all assessments (paginated, filterable by `status`, `type`, `subjectId`, `sortBy`)
- `GET /my` — current user's assessments
- `GET /{assessmentId}` — single assessment (response includes `meetingId` for the linked communication room)
- `POST /` — create (multipart: `assessmentRequest` JSON + `files`) — teacher only
- `PUT /{assessmentId}` — update (multipart) — teacher only
- `DELETE /{assessmentId}` — soft delete — teacher only
- `POST /assign` — assign assessment to classrooms — teacher only
- `GET /{assessmentId}/submissions` — all submissions for assessment — teacher only
- `GET /{assessmentId}/submissions/my` — current student's submissions
- `GET /{assessmentId}/meetingRoom` — get the meeting room linked to this assessment

**Assessment types:** `ASSIGNMENT`, `PRACTICE`, `HOMEWORK`, `MINI_PROJECT`
**Assessment statuses:** `NOT_YET`, `IN_PROGRESS`, `SCHEDULED`, `CLOSED`, `ARCHIVED`

### Submission API (`/api/v1/submissions`)

- `POST /` — submit (multipart: `submissionRequest` JSON + `file`) — student only
- `GET /{submissionId}` — single submission
- `POST /grade` — grade a submission — teacher only
- `DELETE /{submissionId}` — delete — student only

**Submission statuses:** `PENDING`, `SUBMITTED`, `LATE`, `GRADED`, `RESUBMITTED`

### Meeting Room API (`/api/v1/meeting-room`)

Each assessment has one meeting room (1:1 relationship via `assessmentId`). Meeting rooms are auto-created with assessments.

- `GET /{meetingRoomId}` — room details
- `GET /my` — user's meeting rooms (paginated)
- `POST /{meetingRoomId}/join` — join room (tracking)
- `POST /{meetingRoomId}/leave` — leave room
- `PUT /{meetingRoomId}` — close room
- `PUT /{meetingRoomId}/reopen` — reopen room
- `GET /{meetingRoomId}/participants` — participant list
- `GET /{meetingRoomId}/stats` — `{ totalMembers, activeCount }`
- `GET /{meetingRoomId}/active-users` — currently active users
- `GET /{meetingRoomId}/members` — all eligible members (from assigned classrooms)
- `POST /{meetingRoomId}/invite` — invite users — teacher only

**Meeting room statuses:** `OPENED`, `CLOSED`

### PeerJS Signaling (Meeting Room Peers)

The backend tracks PeerJS peer IDs for WebRTC coordination:

- `POST /{meetingRoomId}/peers` — register peer (`{ peerId }`) on join, broadcasts via WebSocket
- `POST /{meetingRoomId}/peers/leave` — unregister peer on leave
- `GET /{meetingRoomId}/peers` — list active peers (`{ activeCount, peers[] }`)

**Peer event types** (broadcast via WS): `JOINED`, `LEFT`, `SYNC`

### Chat API (`/api/v1/chat`)

Chat messages belong to meeting rooms:

- `GET /{meetingRoomId}/messages` — paginated message history
- `POST /{meetingRoomId}/messages` — send message (`{ content, mentionUserIds[] }`)
- `PUT /{meetingRoomId}/messages/{messageId}` — edit message
- `DELETE /{meetingRoomId}?messageId=` — delete message
- `GET /{meetingRoomId}/messages/search?q=` — search messages
- `GET /{meetingRoomId}/messages/{messageId}` — single message (for reply previews)

Chat mutations broadcast via WebSocket to: `/topic/meeting-room/{id}/messages`, `/topic/meeting-room/{id}/messages/delete`, `/topic/meeting-room/{id}/messages/update`

### Work Session API (`/api/v1/work-sessions`)

Time tracking for assessments (students log study time):

- `POST /start` — start session — student only
- `POST /end` — end session — student only
- `GET /my?assessmentId=` — current user's sessions
- `GET /assessment/{assessmentId}` — all sessions for assessment — teacher only

### WebSocket (STOMP over SockJS)

Backend WebSocket endpoint: `{API_BASE_URL}/ws` (SockJS) or `/ws-native` (plain). Uses STOMP protocol with `/topic` prefix for subscriptions, `/app` prefix for sending.

Key topics:
- `/topic/meeting-room/{id}/messages` — new chat messages
- `/topic/meeting-room/{id}/messages/delete` — deleted message IDs
- `/topic/meeting-room/{id}/messages/update` — edited messages
- `/topic/meeting-room/{id}/presence` — peer join/leave events

### Communication Room Architecture (Frontend)

The communication room page (`src/app/(main)/assessment/communication/[id]/page.tsx`) implements:

1. **PeerJS** for peer-to-peer WebRTC video/audio — uses PeerJS cloud server for signaling
2. **Socket.IO** for room presence (join-room, user-joined, user-left, existing-users, raise-hand events)
3. **Screen sharing** via `getDisplayMedia` with track replacement on existing peer connections
4. Local stream → PeerJS peer → Socket.IO room join → call existing peers / answer incoming calls

The frontend uses Socket.IO (`io()`) for real-time signaling, while the backend uses STOMP/SockJS for chat and presence. These are separate channels.

### Role-Based Access

Two roles: `teacher` and `student`. Checked via `session.user.role`:
- Teachers: create/edit/delete assessments, assign to classrooms, grade submissions, invite to meetings, view reports
- Students: view assessments, submit work, log work sessions, join meeting rooms

## Conventions

- Page-local components go in `_components/` directories alongside their page
- Mock data files: `mockData.ts` or `mockupData.ts` next to the page using them
- CSS modules used sparingly alongside Tailwind (e.g. `AssessmentCard.module.css`)
- Server actions pattern: `src/actions/` calls `src/services/` which calls the external API
- Types in `src/types/`, schemas in `src/schemas/` — schemas use Zod v4
- Route config centralized in `src/config/routes.ts` with matcher functions

if you have any questions about the codebase, architecture, or conventions, please ask!
and if you need to make edits, please follow the existing patterns and conventions as closely as possible.
and remember to only edit the files that are relevant to the task at hand, and avoid making unnecessary changes to unrelated files.
and keep your changes focused and concise.
and if you need to add new features or components, please try to reuse existing patterns and styles as much as possible, and avoid introducing new dependencies unless absolutely necessary.
and before give me final result please make sure to test your changes locally and ensure that they work as expected, and that they do not introduce any new bugs or issues.

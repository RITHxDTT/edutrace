---
name: project-assessment-patterns
description: Key patterns, anti-patterns, and fragile areas found in the assessment feature directory
metadata:
  type: project
---

Reviewed the full assessment feature directory on 2026-06-06. Key findings:

**Architecture split:** Teacher path uses server-side pagination (URL params → server action → filtered list). Student path fetches all 100 items at once and does client-side pagination/filtering. This asymmetry is intentional but fragile if student assignment counts grow.

**Work session tracking (StudentAssessmentTabs.tsx):** Uses a module-level `Map` (`pendingEndTimers`) to survive React remounts. Also uses `navigator.sendBeacon` + `keepalive: true` fetch as a fallback to end sessions on page exit. This is the most complex and fragile piece in the codebase — the beacon fires at `/api/work-sessions/end` which is a Next.js route handler (not a server action). Touching this file requires careful attention to unmount/remount timing.

**Classroom normalization hell:** `normalizeClassrooms`, `getAssessmentClassroomOptions`, `resolveClassroomId`, and `getAssessmentClassroomIds` all exist because the session JWT can carry classrooms in multiple shapes (string ID, ClassroomType object, ClassroomProps object with nested `.classrooms`). This is a recurring pain point across `CreateAssessmentModal.tsx`, `AssessmentHeaderActions.tsx`, and `useCreateAssessmentForm.ts`. If the backend API changes the classroom shape, all three must be updated.

**Duplicate utility functions:** `getFileIcon`, `getFileColor`, `formatFileSize` are copy-pasted across `StepAssessment.tsx`, `AttachmentDetailPage.tsx`, and `FileCard.tsx`. The canonical versions now live in `src/utils/fileUtils.ts` — `StudentWorkFileCard.tsx` already imports from there. The other three files should be migrated.

**Incomplete delete:** `AssessmentHeaderActions.tsx` `handleDelete` does only `window.confirm(...)` with no API call. Delete is visually present but functionally a stub.

**WebRTC cleanup:** `useWebRTC.ts` cleanup in the `useEffect` return function is thorough — stops all tracks, destroys the Peer, deactivates STOMP, calls `unregisterPeer`. This is the right pattern; be careful not to simplify it.

**Three separate STOMP clients:** `useWebRTC`, `useStompChat`, and `useMeetingParticipants` each create their own `@stomp/stompjs` `Client` instance. This means 3 WebSocket connections per room visit. Not a bug but worth knowing when debugging connection issues.

**Hardcoded colors in communication room:** The entire `communication/[id]/` tree uses raw hex values (`#1a1a2e`, `#241cab`, `#5d53f9`, `#2a2a4a`) instead of design tokens. This is intentional for the dark-theme room UI, but it means these don't respond to any future theming changes.

**`console.log` left in production paths:** `page.tsx` (assessment list), `[id]/page.tsx`, `StudentWorkStats.tsx`, and `FileCard.tsx` all have `console.log` statements that should be removed before production.

**`TaskDescription.tsx`:** Dead file — stub component with no content, never imported anywhere. Safe to delete.

**`filteredSubmissions` filter is broken:** In `StudentWorkPage.tsx`, `filteredSubmissions` recomputes based on `selectedClassroomId` but always returns the full `submissionList` regardless of the filter value. The classroom filter select is also commented out. This is incomplete/WIP.

**`assessment.module.css` syntax error:** Line 4 has `--badge-color-completed: #E3F5EE --badge-color-soon: #F8EDEA;` (missing semicolon between two declarations). The `.badgeClosed` class referenced in `AssessmentCard.tsx` is not defined in the CSS file. The `badgeNotYet` and `badgeScheduled` classes are also missing from the CSS but referenced in code.

**`DescriptionRender.tsx` uses Tiptap in read-only mode:** This is correct and intentional (`editable: false`). However it instantiates a full editor instance per render just to display HTML. For a lighter alternative, the `dangerouslySetInnerHTML` approach used in `AssessmentCard.tsx` with the `.tiptapPreview` CSS class would have lower overhead — but the Tiptap approach is safer for XSS since Tiptap sanitizes content.

import { Notification } from "./notification.types";

export interface MappedNotification extends Notification {
  senderAvatar?: string;
  senderName?: string;
  senderId?: string;
  link?: string;
  assessmentId?: string;
  assessmentTitle?: string;
  meetingRoomId?: string;
  mentionId?: string;
  assessmentStatus?: string;
  assessmentStartAt?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _original: any;
}

function normalizeInternalPath(path?: string): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("/")) return path;

  if (typeof window === "undefined") return undefined;

  try {
    const url = new URL(path);
    if (url.origin !== window.location.origin) return undefined;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return undefined;
  }
}

export function isScheduledAssessmentNotification(
  notification: MappedNotification
): boolean {
  if (notification.type !== "ASSESSMENT_ASSIGNED") return false;
  if (notification.assessmentStatus?.toUpperCase() === "SCHEDULED") return true;
  if (
    notification.assessmentStartAt &&
    new Date(notification.assessmentStartAt) > new Date()
  )
    return true;
  return false;
}

const VALID_TYPES: Notification["type"][] = [
  "ASSESSMENT_ASSIGNED",
  "ASSESSMENT_DUE",
  "SUBMISSION_GRADED",
  "MEETING_STARTED",
  "MENTION",
  "SUBMISSION_RECEIVED",
];

const ASSESSMENT_NOTIFICATION_TYPES: Notification["type"][] = [
  "ASSESSMENT_ASSIGNED",
  "ASSESSMENT_DUE",
  "SUBMISSION_GRADED",
  "SUBMISSION_RECEIVED",
  "MEETING_STARTED",
];

function buildAssessmentListPath(assessmentTitle?: string): string {
  if (!assessmentTitle) return "/assessment";

  const params = new URLSearchParams();
  params.set("notificationTitle", assessmentTitle);
  return `/assessment?${params.toString()}`;
}

export function resolveNotificationPath(
  notification: MappedNotification
): string | null {
  // 1. Use the pre-built specific link from the payload
  const link = normalizeInternalPath(notification.link);
  if (link) return link;

  // 2. Build from stored IDs
  if (notification.meetingRoomId) {
    return `/assessment/communication/${notification.meetingRoomId}`;
  }

  if (
    notification.assessmentId &&
    (notification.type === "ASSESSMENT_ASSIGNED" ||
      notification.type === "ASSESSMENT_DUE" ||
      notification.type === "SUBMISSION_GRADED" ||
      notification.type === "SUBMISSION_RECEIVED" ||
      notification.type === "MEETING_STARTED")
  ) {
    return `/assessment/${notification.assessmentId}`;
  }

  if (ASSESSMENT_NOTIFICATION_TYPES.includes(notification.type)) {
    return buildAssessmentListPath(notification.assessmentTitle);
  }

  if (notification.mentionId) {
    return `/dashboard?mention=${notification.mentionId}`;
  }

  if (notification.type === "MENTION") {
    return "/dashboard";
  }

  // 3. No specific destination
  return null;
}

type NotificationPayload = Record<string, unknown>;

function stringifyPayloadValue(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return undefined;
}

function getPathValue(data: NotificationPayload, path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) => {
    if (!current || typeof current !== "object") return undefined;
    return (current as NotificationPayload)[key];
  }, data);
}

function extractQuotedAssessmentTitle(text: string): string | undefined {
  const match = text.match(/["“”']([^"“”']+)["“”']/);
  return match?.[1]?.trim() || undefined;
}

// Helper: pick first truthy primitive value from flat or dot-path keys.
function pick(data: NotificationPayload, ...keys: string[]): string | undefined {
  for (const key of keys) {
    const val = key.includes(".") ? getPathValue(data, key) : data[key];
    const stringValue = stringifyPayloadValue(val);
    if (stringValue) return stringValue;
  }
  return undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapKnockItemToNotification(item: any): MappedNotification {
  const itemData = (item.data || {}) as Record<string, unknown>;

  let title = (itemData.title as string) || "";
  let content = (itemData.content as string) || "";
  const senderName = pick(itemData, "sender_name", "senderName", "sender");
  const senderId = pick(itemData, "send_id", "senderId", "sender_id", "userId", "user_id");
  const timestamp = pick(itemData, "timestamp", "created_at", "createdAt");

  // Try every possible field name your backend might use for the assessment/task ID
  const assessmentId = pick(
    itemData,
    "targetAssessmentId",
    "target_assessment_id",
    "target.id",
    "target.assessmentId",
    "target.assessment_id",
    "target.taskId",
    "target.task_id",
    "referenceId",
    "reference_id",
    "relatedId",
    "related_id",
    "related.id",
    "related.assessmentId",
    "related.assessment_id",
    "related.taskId",
    "related.task_id",
    "related_task_id",
    "resourceId",
    "resource_id",
    "assessmentId",
    "assessment_id",
    "assessment.id",
    "assessment.assessmentId",
    "assessment.assessment_id",
    "taskId",
    "task_id",
    "task.id",
    "task.taskId",
    "task.task_id",
    "task.assessmentId",
    "task.assessment_id",
    "assignmentId",
    "assignment_id",
    "assignment.id",
    "assignment.assignmentId",
    "assignment.assignment_id",
    "assignment.assessmentId",
    "assignment.assessment_id",
    "submission.assessmentId",
    "submission.assessment_id",
    "resource.assessmentId",
    "resource.assessment_id",
    "id",
    "entityId",
    "entity_id",
    "entity.id",
    "entity.assessmentId",
    "entity.assessment_id",
    "objectId",
    "object_id",
    "object.id",
    "object.assessmentId",
    "object.assessment_id",
    "metadata.assessmentId",
    "metadata.assessment_id",
    "metadata.taskId",
    "metadata.task_id",
    "data.assessmentId",
    "data.assessment_id",
    "data.taskId",
    "data.task_id",
    "courseId",      // some platforms nest under course
    "course_id",
  );

  const payloadAssessmentTitle = pick(
    itemData,
    "assessmentTitle",
    "assessment_title",
    "assessment.title",
    "taskTitle",
    "task_title",
    "task.title",
    "assignmentTitle",
    "assignment_title",
    "assignment.title",
    "target.title",
    "related.title",
    "metadata.assessmentTitle",
    "metadata.assessment_title",
    "metadata.taskTitle",
    "metadata.task_title",
  );

  const meetingRoomId = pick(
    itemData,
    "meetingRoomId",
    "meeting_room_id",
    "meetingRoom.id",
    "meetingRoom.meetingRoomId",
    "meetingRoom.meeting_room_id",
    "roomId",
    "room_id",
    "room.id",
    "meetingId",
    "meeting_id",
    "meeting.id",
    "sessionId",
    "session_id",
  );

  const mentionId = pick(
    itemData,
    "mentionId",
    "mention_id",
    "mention.id",
    "messageId",
    "message_id",
    "message.id",
    "commentId",
    "comment_id",
    "comment.id",
  );

  const assessmentStatus = pick(itemData, "assessmentStatus", "assessment.status", "status", "state");
  const assessmentStartAt = pick(
    itemData,
    "startAt",
    "start_at",
    "assessment.startAt",
    "assessment.start_at",
    "scheduledAt",
    "scheduled_at",
  );

  // Build the most specific link possible from payload fields
  // Also try direct link fields from the payload
  const link =
    normalizeInternalPath(
      pick(
        itemData,
        "link",
        "url",
        "actionUrl",
        "action_url",
        "redirectUrl",
        "redirect_url",
        "href",
        "action.url",
        "action.href",
        "metadata.link",
        "metadata.url",
      ),
    ) ||
    (meetingRoomId ? `/assessment/communication/${meetingRoomId}` : undefined) ||
    (assessmentId ? `/assessment/${assessmentId}` : undefined) ||
    (mentionId ? `/dashboard?mention=${mentionId}` : undefined) ||
    undefined;

  // Fallback to Knock message blocks if payload fields are missing
  if (!title && item.blocks?.length > 0) {
    title = item.blocks[0].content || item.blocks[0].text || "";
  }
  if (!content && item.blocks?.length > 1) {
    content = item.blocks[1].content || item.blocks[1].text || "";
  }
  if (!title) title = "New Notification";
  if (!content && item.blocks?.length > 0) {
    content = item.blocks[0].content || item.blocks[0].text || "";
  }
  const assessmentTitle =
    payloadAssessmentTitle || extractQuotedAssessmentTitle(`${title} ${content}`);

  let type: Notification["type"] = "ASSESSMENT_ASSIGNED";
  const incomingType = String(itemData.type || "").toUpperCase();

  let resolvedType = incomingType;
  if (
    resolvedType === "TASK_ASSIGNED" ||
    resolvedType === "TASK" ||
    resolvedType === "ASSIGNMENT"
  ) {
    resolvedType = "ASSESSMENT_ASSIGNED";
  } else if (resolvedType === "TASK_DUE" || resolvedType === "TASK_OVERDUE") {
    resolvedType = "ASSESSMENT_DUE";
  } else if (resolvedType === "TASK_GRADED") {
    resolvedType = "SUBMISSION_GRADED";
  }

  if (VALID_TYPES.includes(resolvedType as Notification["type"])) {
    type = resolvedType as Notification["type"];
  } else {
    const text = `${title} ${content}`.toLowerCase();
    const rawType = String(itemData.type || "").toUpperCase();

    if (rawType === "ASSIGNMENT" || rawType === "TASK" || rawType === "TASK_ASSIGNED")
      type = "ASSESSMENT_ASSIGNED";
    else if (text.includes("due") || rawType === "TASK_DUE")
      type = "ASSESSMENT_DUE";
    else if (text.includes("graded") || text.includes("grade") || rawType === "TASK_GRADED")
      type = "SUBMISSION_GRADED";
    else if (text.includes("meeting") || text.includes("started"))
      type = "MEETING_STARTED";
    else if (text.includes("mention") || text.includes("mentioned"))
      type = "MENTION";
    else if (
      text.includes("submission") ||
      text.includes("submitted") ||
      text.includes("received")
    )
      type = "SUBMISSION_RECEIVED";
    else if (text.includes("assign")) type = "ASSESSMENT_ASSIGNED";
  }

  const actorAvatar = item.actors?.[0]
    ? ((item.actors[0] as Record<string, unknown>).avatar as string)
    : undefined;

  return {
    notificationId: item.id,
    title,
    content,
    type,
    isRead: !!item.read_at,
    createdAt: timestamp || item.inserted_at,
    senderAvatar: (itemData.senderAvatar as string) || actorAvatar || undefined,
    senderName,
    senderId,
    link,
    assessmentId,
    assessmentTitle,
    meetingRoomId,
    mentionId,
    assessmentStatus,
    assessmentStartAt,
    _original: item,
  };
}

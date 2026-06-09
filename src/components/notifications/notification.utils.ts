import { Notification } from "./notification.types";

export interface MappedNotification extends Notification {
  senderAvatar?: string;
  senderName?: string;
  senderId?: string;
  link?: string;
  assessmentStatus?: string;
  assessmentStartAt?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _original: any;
}

export function isScheduledAssessmentNotification(notification: MappedNotification): boolean {
  if (notification.type !== "ASSESSMENT_ASSIGNED") return false;
  if (notification.assessmentStatus?.toUpperCase() === "SCHEDULED") return true;
  if (notification.assessmentStartAt && new Date(notification.assessmentStartAt) > new Date()) return true;
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

export function resolveNotificationPath(notification: MappedNotification): string | null {
  if (notification.link) return notification.link;

  switch (notification.type) {
    case "ASSESSMENT_ASSIGNED":
    case "ASSESSMENT_DUE":
    case "SUBMISSION_GRADED":
    case "SUBMISSION_RECEIVED":
      return "/assessment";
    case "MEETING_STARTED":
      return "/assessment";
    case "MENTION":
      return "/dashboard";
    default:
      return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapKnockItemToNotification(item: any): MappedNotification {
  const itemData = (item.data || {}) as Record<string, unknown>;

  let title = (itemData.title as string) || "";
  let content = (itemData.content as string) || "";
  const senderName = (itemData.sender_name as string) || undefined;
  const senderId = (itemData.send_id as string) || undefined;
  const timestamp = (itemData.timestamp as string) || undefined;
  const assessmentId =
    (itemData.assessmentId as string) || (itemData.assessment_id as string) || undefined;
  const meetingRoomId =
    (itemData.meetingRoomId as string) || (itemData.meeting_room_id as string) || undefined;
  const assessmentStatus =
    (itemData.assessmentStatus as string) || (itemData.status as string) || undefined;
  const assessmentStartAt =
    (itemData.startAt as string) || (itemData.start_at as string) || undefined;
  const link =
    (itemData.link as string) ||
    (itemData.url as string) ||
    (itemData.actionUrl as string) ||
    (meetingRoomId ? `/assessment/communication/${meetingRoomId}` : undefined) ||
    (assessmentId ? `/assessment/${assessmentId}` : undefined) ||
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

  // Resolve type from payload, then fall back to keyword detection
  let type: Notification["type"] = "ASSESSMENT_ASSIGNED";
  const incomingType = String(itemData.type || "").toUpperCase() as Notification["type"];

  if (VALID_TYPES.includes(incomingType)) {
    type = incomingType;
  } else {
    const text = `${title} ${content}`.toLowerCase();
    if (text.includes("due")) type = "ASSESSMENT_DUE";
    else if (text.includes("graded") || text.includes("grade")) type = "SUBMISSION_GRADED";
    else if (text.includes("meeting") || text.includes("started")) type = "MEETING_STARTED";
    else if (text.includes("mention") || text.includes("mentioned")) type = "MENTION";
    else if (text.includes("submission") || text.includes("submitted") || text.includes("received")) type = "SUBMISSION_RECEIVED";
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
    assessmentStatus,
    assessmentStartAt,
    _original: item,
  };
}

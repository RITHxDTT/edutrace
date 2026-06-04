import { Notification } from "./notification.types";

export interface MappedNotification extends Notification {
  senderAvatar?: string;
  senderName?: string;
  senderId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _original: any; // Keep reference to original Knock item for markAsRead methods
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapKnockItemToNotification(item: any): MappedNotification {
  const itemData = (item.data || {}) as Record<string, unknown>;
  
  // Extract custom fields from the payload
  let title = (itemData.title as string) || "";
  let content = (itemData.content as string) || "";
  const senderName = (itemData.sender_name as string) || undefined;
  const senderId = (itemData.send_id as string) || undefined;
  const timestamp = (itemData.timestamp as string) || undefined;

  // Fallbacks using Knock's blocks if title/content is missing in payload
  if (!title && item.blocks && item.blocks.length > 0) {
    title = item.blocks[0].content || item.blocks[0].text || "";
  }
  if (!content && item.blocks && item.blocks.length > 1) {
    content = item.blocks[1].content || item.blocks[1].text || "";
  }

  // Final fallback text
  if (!title) {
    title = "New Notification";
  }
  if (!content && item.blocks && item.blocks.length > 0) {
    content = item.blocks[0].content || item.blocks[0].text || "";
  }

  // Determine standard notification type
  let type: Notification["type"] = "ANNOUNCEMENT";
  const incomingType = String(itemData.type || "").toUpperCase();
  if (
    [
      "ASSIGNMENT",
      "SUBMISSION",
      "GRADE",
      "ANNOUNCEMENT",
      "FEEDBACK",
      "FILE_UPLOAD",
    ].includes(incomingType)
  ) {
    type = incomingType as Notification["type"];
  } else {
    // Check keywords in title/content
    const searchString = `${title} ${content}`.toLowerCase();
    if (searchString.includes("assignment")) type = "ASSIGNMENT";
    else if (searchString.includes("submission")) type = "SUBMISSION";
    else if (searchString.includes("grade")) type = "GRADE";
    else if (searchString.includes("feedback")) type = "FEEDBACK";
    else if (searchString.includes("upload") || searchString.includes("file")) type = "FILE_UPLOAD";
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
    // Use payload's timestamp if present, otherwise fall back to Knock's creation time
    createdAt: timestamp || item.inserted_at,
    senderAvatar: (itemData.senderAvatar as string) || actorAvatar || undefined,
    senderName,
    senderId,
    _original: item,
  };
}

import type { ChatMessageResponse } from "@/types/messageRespone";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

function headers(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export interface PaginatedMessages {
  content: ChatMessageResponse[];
  totalPages: number;
  totalElements: number;
  last: boolean;
  number: number;
}

export async function getChatMessages(
  meetingRoomId: string,
  token: string,
  page = 0,
  size = 30,
): Promise<PaginatedMessages> {
  const res = await fetch(
    `${API}/chat/${meetingRoomId}/messages?page=${page}&size=${size}`,
    { headers: headers(token) },
  );
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message ?? `Failed to load messages: ${res.status}`);
  }
  return json.payload as PaginatedMessages;
}

export async function sendChatMessage(
  meetingRoomId: string,
  content: string,
  mentionUserIds: string[],
  token: string,
): Promise<ChatMessageResponse> {
  const res = await fetch(`${API}/chat/${meetingRoomId}/messages`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify({ content, mentionUserIds }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message ?? `Failed to send message: ${res.status}`);
  }
  return json.payload as ChatMessageResponse;
}

export async function deleteChatMessage(
  meetingRoomId: string,
  messageId: string,
  token: string,
): Promise<void> {
  const res = await fetch(
    `${API}/chat/${meetingRoomId}?messageId=${messageId}`,
    { method: "DELETE", headers: headers(token) },
  );
  if (!res.ok) throw new Error(`Failed to delete message: ${res.status}`);
}

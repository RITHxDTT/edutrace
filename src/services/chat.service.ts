import type { ChatMessageResponse } from "@/types/messageRespone";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

function headers(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function unwrap<T>(res: Response): Promise<T> {
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message ?? `Request failed: ${res.status}`);
  }
  return json.payload as T;
}

export async function getChatMessages(
  meetingRoomId: string,
  token: string,
  page = 1,
  size = 30,
): Promise<ChatMessageResponse[]> {
  const res = await fetch(
    `${API}/chat/${meetingRoomId}/messages?page=${page}&size=${size}`,
    { headers: headers(token) },
  );
  return unwrap<ChatMessageResponse[]>(res);
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
  return unwrap<ChatMessageResponse>(res);
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

export async function updateChatMessage(
  meetingRoomId: string,
  messageId: string,
  content: string,
  token: string,
): Promise<ChatMessageResponse> {
  const res = await fetch(
    `${API}/chat/${meetingRoomId}/messages/${messageId}`,
    {
      method: "PUT",
      headers: headers(token),
      body: JSON.stringify({ content }),
    },
  );
  return unwrap<ChatMessageResponse>(res);
}

export async function searchChatMessages(
  meetingRoomId: string,
  query: string,
  token: string,
): Promise<ChatMessageResponse[]> {
  const res = await fetch(
    `${API}/chat/${meetingRoomId}/messages/search?q=${encodeURIComponent(query)}`,
    { headers: headers(token) },
  );
  return unwrap<ChatMessageResponse[]>(res);
}

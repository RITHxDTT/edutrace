export function getMeetingRoomStompBrokerUrl() {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBase) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
  }

  const url = new URL("/ws-native", apiBase);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";

  // console.log(url.toString());
  return url.toString();
}

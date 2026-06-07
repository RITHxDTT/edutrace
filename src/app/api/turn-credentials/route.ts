import { NextResponse } from "next/server";

interface CloudflareTurnResponse {
  iceServers: {
    urls: string[];
    username: string;
    credential: string;
  };
}

// Generates short-lived Cloudflare TURN credentials on the server so the
// CLOUDFLARE_TURN_API_TOKEN never reaches the browser.
// Called once per room join from useWebRTC's init() function.
export async function GET() {
  const keyId = process.env.CLOUDFLARE_TURN_KEY_ID;
  const apiToken = process.env.CLOUDFLARE_TURN_API_TOKEN;

  if (!keyId || !apiToken) {
    return NextResponse.json(
      { error: "CLOUDFLARE_TURN_KEY_ID / CLOUDFLARE_TURN_API_TOKEN not set" },
      { status: 503 },
    );
  }

  try {
    const cfRes = await fetch(
      `https://rtc.live.cloudflare.com/v1/turn/keys/${keyId}/credentials/generate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        // 24 h is the maximum TTL Cloudflare allows.
        body: JSON.stringify({ ttl: 86400 }),
        // Never let Next.js cache this on the server — every call must hit Cloudflare.
        cache: "no-store",
      },
    );

    if (!cfRes.ok) {
      const body = await cfRes.text();
      console.error("[turn-credentials] Cloudflare API error:", cfRes.status, body);
      return NextResponse.json(
        { error: "Cloudflare TURN API returned an error" },
        { status: cfRes.status },
      );
    }

    const data: CloudflareTurnResponse = await cfRes.json();

    // Cloudflare returns one iceServers object whose `urls` array contains STUN
    // and TURN entries. We spread it into RTCIceServer[] and prepend Google STUN
    // for faster same-network (direct) connections.
    const iceServers: RTCIceServer[] = [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      {
        urls: data.iceServers.urls,
        username: data.iceServers.username,
        credential: data.iceServers.credential,
      },
    ];

    return NextResponse.json(
      { iceServers },
      {
        headers: {
          // Credentials expire — never cache at the HTTP or CDN layer.
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  } catch (err) {
    console.error("[turn-credentials] fetch failed:", err);
    return NextResponse.json(
      { error: "Could not reach Cloudflare TURN API" },
      { status: 502 },
    );
  }
}

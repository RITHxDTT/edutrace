import { NextResponse } from "next/server";
import headerToken from "@/lib/headerToken";

async function handleAiRequest(question: string, headers: Record<string, string>) {
  if (!headers.Authorization) {
    console.error("AI proxy missing bearer token - session may not exist");
    return NextResponse.json(
      { error: "Authentication required. Please log in." },
      { status: 401 }
    );
  }

  const proxyHeaders = {
    ...headers,
    "Content-Type": "application/json",
    "Accept": "text/event-stream",
  };

  const backendUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.yannvanneth.dev/api/v1"}/ai/teacher/ask/stream`;
  console.log("AI proxy calling:", backendUrl);

  const backendResponse = await fetch(backendUrl, {
    method: "POST",
    headers: proxyHeaders,
    body: JSON.stringify({ question }),
  });

  console.log("AI backend response status:", backendResponse.status);

  if (!backendResponse.ok) {
    const errorBody = await backendResponse.text();
    console.error("AI backend error:", backendResponse.status, errorBody);
    return NextResponse.json(
      { error: `Backend error: ${backendResponse.statusText}` },
      { status: backendResponse.status }
    );
  }

  if (!backendResponse.body) {
    return NextResponse.json(
      { error: "Backend stream response body is missing." },
      { status: 502 }
    );
  }

  const contentType = backendResponse.headers.get("content-type") ?? "text/event-stream";
  const responseHeaders = new Headers({
    "Content-Type": contentType,
  });

  return new Response(backendResponse.body, {
    status: backendResponse.status,
    headers: responseHeaders,
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const question = searchParams.get("question");

    if (!question) {
      return NextResponse.json(
        { error: "Missing 'question' query parameter" },
        { status: 400 }
      );
    }

    const headers = await headerToken();
    console.log("AI proxy auth header:", headers.Authorization ? "present" : "MISSING");

    if (!headers.Authorization) {
      console.error("AI proxy missing bearer token - session may not exist");
      return NextResponse.json(
        { error: "Authentication required. Please log in." },
        { status: 401 }
      );
    }

    const proxyHeaders = {
      ...headers,
      "Content-Type": "application/json",
      "Accept": "text/event-stream",
    };

    const backendUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.yannvanneth.dev/api/v1"}/ai/teacher/ask/stream`;
    console.log("AI proxy calling:", backendUrl);

    const backendResponse = await fetch(backendUrl, {
      method: "POST",
      headers: proxyHeaders,
      body: JSON.stringify({ question }),
    });

    console.log("AI backend response status:", backendResponse.status);

    if (!backendResponse.ok) {
      const errorBody = await backendResponse.text();
      console.error("AI backend error:", backendResponse.status, errorBody);
      return NextResponse.json(
        { error: `Backend error: ${backendResponse.statusText}` },
        { status: backendResponse.status }
      );
    }

    if (!backendResponse.body) {
      return NextResponse.json(
        { error: "Backend stream response body is missing." },
        { status: 502 }
      );
    }

    // Set proper streaming headers
    const streamHeaders = new Headers({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*",
    });

    // Create a readable stream that passes through the backend response
    const reader = backendResponse.body.getReader();
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              console.log("Stream reading complete");
              controller.close();
              break;
            }
            // Immediately enqueue each chunk as it arrives
            controller.enqueue(value);
            console.log("Streamed chunk:", new TextDecoder().decode(value).substring(0, 50));
          }
        } catch (error) {
          console.error("Stream reading error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      status: 200,
      headers: streamHeaders,
    });
  } catch (error) {
    console.error("AI proxy GET error:", error);
    return NextResponse.json(
      { error: "Unable to proxy AI request." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const headers = await headerToken();

    console.log("AI proxy auth header:", headers.Authorization ? "present" : "MISSING");

    return await handleAiRequest(requestBody.question, headers);
  } catch (error) {
    console.error("AI proxy POST error:", error);
    return NextResponse.json(
      { error: "Unable to proxy AI request." },
      { status: 500 }
    );
  }
}

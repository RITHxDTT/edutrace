import { endWorkSessionService } from "@/services/assessment.service";

export async function POST(request: Request) {
  let body: { assessmentId?: string; workSessionId?: string } = {};

  try {
    const text = await request.text();
    body = text ? JSON.parse(text) : {};
  } catch {
    return Response.json(
      { success: false, message: "Invalid work session payload." },
      { status: 400 },
    );
  }

  if (!body.assessmentId) {
    return Response.json(
      { success: false, message: "assessmentId is required." },
      { status: 400 },
    );
  }

  const result = await endWorkSessionService(
    body.assessmentId,
    body.workSessionId,
  );

  if (!result.success) {
    return Response.json(
      { success: false, message: result.error },
      { status: 400 },
    );
  }

  return Response.json({ success: true, payload: result.data });
}

"use server"

import { getMeetingRoomByAssessmentIdService } from "@/services/meeting.service";

export const getMeetingRoomByAssessmentIdAction = async (assessmentId: string) => {

    const result = await getMeetingRoomByAssessmentIdService(assessmentId);

    if (!result.success) {
        return { error: result.error || "Failed to fetch meeting room ID" };
    }
    return result.payload;
}
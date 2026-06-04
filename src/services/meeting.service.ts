import headerToken from "@/lib/headerToken"

export const getMeetingRoomByAssessmentIdService = async (assessmentId: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/assessments/${assessmentId}/meetingRoom`, {
        headers: await headerToken()
    })
    
    const result = await res.json();

    return result;
} 
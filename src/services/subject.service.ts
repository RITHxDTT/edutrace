import headerToken from "@/lib/headerToken"

export const getSubjectById = async (subjectId: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/subjects/${subjectId}`, {
        headers: await headerToken()
    })

    const result = await res.json();

    if (!res.ok) {
        return {
            success: false,
            error: result?.message || "Failed to change password",
        };
    }

    return { success: true, data: result };
}

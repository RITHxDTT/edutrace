import headerToken from "@/lib/headerToken";

export const getAllClassroomsService = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/classrooms`, {
        headers: await headerToken()
    });
    const result = await res.json();
    return result;
}
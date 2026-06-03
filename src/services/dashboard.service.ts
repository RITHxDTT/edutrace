import {auth} from "@/auth";
import {ApiResponse} from "@/types/ApiResponse";
import {DashboardStudentPayload, DashboardTeacherPayload} from "@/types/dashboard";

const BASE_URL : string | undefined = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getDashboardData(): Promise<ApiResponse<DashboardTeacherPayload | DashboardStudentPayload | undefined>> {
    try {
        const session = await auth();
        const accessToken = session?.access_token;

        if (!accessToken) {
            throw new Error("No access token found");
        }

        const response = await fetch(`${BASE_URL}/dashboard`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to fetch dashboard data");
        }

        return await response.json();

    } catch (error: unknown) {
        console.error("Error fetching dashboard data:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "An unexpected error occurred",
            status: 500,
            path: "/dashboard",
            timestamp: new Date().toISOString()
        } as ApiResponse<undefined>;
    }
}
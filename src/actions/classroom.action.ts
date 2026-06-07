'use server'
import { getAllClassroomsService } from "@/services/classroom.service";

export const getAllClassroomsAction = async () => {
    const result = await getAllClassroomsService();
    if (!result.success) {
        return { error: result.message };
    }

    return result.payload;
};

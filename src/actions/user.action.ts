"use server";

import { changePasswordService, changeProfileImageService } from "@/services/user.service";

export const changeProfileImageAction = async (
    file: File
) => {
    try {
        const result = await changeProfileImageService(file);

        if (!result.success) {
            return {
                success: false,
                error: result.error,
            };
        }

        return {
            success: true,
            data: result.data,
        };
    } catch (error) {
        console.error("Change profile image error:", error);

        return {
            success: false,
            error: "Something went wrong while uploading image.",
        };
    }
};

export const changePasswordAction = async (
    oldPassword: string,
    newPassword: string,
    confirmNewPassword: string
) => {
    try {
        const result = await changePasswordService(oldPassword, newPassword, confirmNewPassword);

        if (!result.success) {
            return {
                success: false,
                error: result.error,
            };
        }

        return {
            success: true,
            data: result.data,
        };
    } catch (error) {
        console.error("Change password error:", error);

        return {
            success: false,
            error: "Something went wrong while changing password.",
        };
    }
};
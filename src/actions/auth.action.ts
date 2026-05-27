"use server";

import { ForgotPasswordFormData, LoginFormData, OtpFormData, RegisterFormData, ResetPasswordFormData } from "@/types/auth";
import { signIn } from "@/auth";
import { forgotPasswordService, registerService, resendOtpCodeService, resetPasswordService, verifyOtpService } from "@/services/auth.service";

/**
 * LOGIN ACTION
 */
export async function loginAction(data: LoginFormData) {
    try {
        await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false
        });
        return { success: true, error: null };
    } catch (err) {
        return { success: false, error: "Invalid Credentials." };
    }
}

/**
 * REGISTER ACTION
 */
export async function registerAction(
    data: Omit<RegisterFormData, "birthdate"> & {
        birthdate?: string;
    }
) {
    try {
        const res = await registerService(data)
        if (res?.error) {
            return { error: res.error };
        }
        return { success: true, error: null };
    } catch (err) {
        return { error: "Something went wrong" };
    }
}

export async function verifyEmailAction(data: OtpFormData, action: "REGISTRATION" | "FORGOT_PASSWORD") {
    try {
        const res = await verifyOtpService(data, action);

        return {
            success: true,
            payload: res.payload,
            message: res.message,
            error: null,
        };
    } catch (err) {
        const message =
            err instanceof Error ? err.message : 'Something went wrong';

        return { success: false, error: message };
    }
}

export async function forgotPasswordAction(email: string) {
    try {
        const res = await forgotPasswordService(email);
        return { success: true, message: res.message, error: null };
    } catch (err) {
        return {
            success: false,
            error: err instanceof Error ? err.message : "Something went wrong",
        };
    }
}

export async function resetPasswordAction(data: ForgotPasswordFormData, token: string) {
    try {
        const res = await resetPasswordService({
            token,
            newPassword: data.newPassword,
            confirmNewPassword: data.confirmNewPassword,
        });
        return { success: true, message: res.message, error: null };
    } catch (err) {
        return {
            success: false,
            error: err instanceof Error ? err.message : "Something went wrong",
        };
    }
}

export async function resendEmailAction(email: string, action: "REGISTRATION") {
    try {
        await resendOtpCodeService(email, action);
        return { success: true, error: null };
    } catch (err) {
        const message =
            err instanceof Error ? err.message : 'Something went wrong';
        console.log(err)
        return { success: false, error: message };
    }
}
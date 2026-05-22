"use server";

import { LoginFormData, RegisterFormData } from "@/types/auth";
import { signIn } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { registerService } from "@/services/auth.service";

/**
 * LOGIN ACTION
 */
export async function loginAction(data: LoginFormData) {
    try {
        const result = await signIn("credentials", {
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
    data: RegisterFormData
) {
    try {
        const res = await registerService(data)
        if (res?.error) {
            return { error: res.error };
        }
    } catch (err) {
        console.log(err)
        return { error: "Something went wrong" };
    }
}
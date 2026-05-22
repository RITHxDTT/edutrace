"use server";

import { LoginFormData, RegisterFormData } from "@/types/auth";
import { signIn } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { signOut } from "next-auth/react";

/**
 * LOGIN ACTION
 */
export async function loginAction(data: LoginFormData) {
    try {
        await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirectTo: "/dashboard"
        });
    } catch (err) {
        if (isRedirectError(err)) throw err;

        console.error("Login Action Error:", err);
        return { error: "Invalid email or password" + err };
    }
}

// export async function registerAction(data: RegisterFormData) {
//     try {
//         await registerService(data);
//     }
// }
/**
 * LOGOUT ACTION
 */
export async function logoutAction() {
    await signOut({ redirectTo: "/" })
}
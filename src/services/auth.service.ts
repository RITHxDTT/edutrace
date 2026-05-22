import { registerFormSchema } from "@/schemas/RegisterFormSchema";
import { RegisterFormData } from "@/types/auth";
import z from "zod";

export const loginService = async (req: Partial<Record<"email" | "password", unknown>>) => {
    const formData = {
        email: req?.email,
        password: req?.password
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });

    if (!res.ok) {
        try {
            const errorPayload = await res.json();
            throw new Error(errorPayload?.message || "Authentication failed");
        } catch (e: any) {
            throw new Error(e.message || "An unexpected error occurred");
        }
    }

    const user = await res.json();
    return user;
};


export const registerService = async (data: RegisterFormData) => {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }
    );

    if (!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(
            error?.message ?? `Registration failed with status ${res.status}`
        );
    }

    return res.json();
};
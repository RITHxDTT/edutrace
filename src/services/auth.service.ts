
import {
  OtpFormData,
  RegisterFormData,
  ResetPasswordFormData
} from "@/types/auth";

interface ApiErrorResponse {
  message?: string;
}

export const loginService = async (
  req: Partial<Record<"email" | "password", unknown>>
) => {

  const formData = {
    email: req?.email,
    password: req?.password,
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }
  );

  if (!res.ok) {

    let errorPayload: ApiErrorResponse | null = null;

    try {
      errorPayload = await res.json();
    } catch {
      throw new Error("An unexpected error occurred");
    }

    throw new Error(
      errorPayload?.message || "Authentication failed"
    );
  }

  return res.json();
};

export const registerService = async (
  data: RegisterFormData
) => {

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
    }
  );

  const result = await res.json().catch(() => null);

  if (!res.ok) {
    return {
      success: false,
      error: result?.message || "Registration failed",
    };
  }

  return result;
};

export const verifyOtpService = async (
  data: OtpFormData,
  action: "REGISTRATION" | "FORGOT_PASSWORD"
) => {

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/otp/verify`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: data.email,
        code: data.code,
        action
      }),
    }
  );

  const result = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      result?.message || "OTP verification failed"
    );
  }

  return result;
};

export const forgotPasswordService = async (
  email: string
) => {

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/otp/send`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email }),
    }
  );

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      data?.message || "Failed to send reset request"
    );
  }

  return data;
};

export const resetPasswordService = async (
  data: ResetPasswordFormData
) => {

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/password/reset`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
    }
  );

  const result = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      result?.message || "Password reset failed"
    );
  }

  return result;
};

export const resendOtpCodeService = async (
  email: string,
  action: "REGISTRATION" | "FORGOT_PASSWORD"
) => {

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/otp/resend`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        action
      }),
    }
  );

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      data?.message ||
      `Resend OTP failed with status ${res.status}`
    );
  }

  return data;
};


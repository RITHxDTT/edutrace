import { auth } from "@/auth";

export const changeProfileImageService = async (file: File) => {
  const session = await auth();
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/upload`,
    {
      method: "POST",
      body: form,
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    },
  );

  const result = await res.json();

  if (!res.ok) {
    return {
      success: false,
      error: result?.message || "Failed to upload image",
    };
  }
  if (!res.ok) {
    return {
      success: false,
      error: result?.message || "Failed to upload image",
    };
  }

  return {
    success: true,
    data: result,
  };
};

export type UpdateUserPayload = {
  firstName: string;
  lastName: string;
  gender?: "MALE" | "FEMALE" | "";
  address?: string;
  profileImageUrl?: string;
  birthdate: string;
};

export const updateUserService = async (payload: UpdateUserPayload) => {
  const session = await auth();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access_token}`,
    },
    body: JSON.stringify(payload),
  });

  const result = await res.json();

  if (!res.ok) {
    return {
      success: false,
      error: result?.message || "Failed to update profile",
    };
  }

  return {
    success: true,
    data: result,
  };
};

export const verifyPasswordService = async (currentPassword: string) => {
  const session = await auth();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({
        currentPassword,
      }),
    },
  );

  const result = await res.json();
  console.log("verify-password response:", JSON.stringify(result));

  if (!res.ok) {
    return {
      success: false,
      error: result?.message || "Invalid password",
    };
  }

  return {
    success: true,
    data: result,
  };
};

export const changePasswordService = async (
  token: string,
  newPassword: string,
) => {
  const session = await auth();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/password/reset`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({
        token,
        newPassword,
      }),
    },
  );

  const result = await res.json();

  if (!res.ok) {
    return {
      success: false,
      error: result?.message || "Failed to change password",
    };
  }

  return {
    success: true,
    data: result,
  };
};

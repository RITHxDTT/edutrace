import { auth } from "@/auth";

export const changeProfileImageService = async (file: File) => {
  const session = await auth();
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/upload`, {
    method: "POST",
    body: form,
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    }
  });

  const result = await res.json();

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
}

export const changePasswordService = async (
  oldPassword: string,
  newPassword: string,
  confirmNewPassword: string
) => {
  const session = await auth();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/password/change`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access_token}`,
    },
    body: JSON.stringify({ oldPassword, newPassword, confirmNewPassword }),
  });

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
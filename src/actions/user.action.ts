"use server";

import {
  changePasswordService,
  changeProfileImageService,
  UpdateUserPayload,
  updateUserService,
  verifyPasswordService,
  getUserByIdService,
} from "@/services/user.service";

export const getUserByIdAction = async (userId: string) => {
  try {
    const result = await getUserByIdService(userId);
    console.log(result)

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
    console.error("Get user profile error:", error);

    return {
      success: false,
      error: "Something went wrong while getting user profile.",
    };
  }
};

export const updateUserAction = async (payload: UpdateUserPayload) => {
  try {
    const result = await updateUserService(payload);

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
    console.error("Update user error:", error);

    return {
      success: false,
      error: "Something went wrong while updating profile.",
    };
  }
};

export const changeProfileImageAction = async (file: File) => {
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

// checking the current password
export const verifyPasswordAction = async (currentPassword: string) => {
  try {
    const result = await verifyPasswordService(currentPassword);

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    return {
      success: true,
      token: result.data.payload.token,
    };
  } catch (error) {
    console.error("Verify password error:", error);

    return {
      success: false,
      error: "Something went wrong while verifying password.",
    };
  }
};

export const changePasswordAction = async (
  token: string,
  newPassword: string,
  confirmNewPassword: string,
) => {
  try {
    if (newPassword !== confirmNewPassword) {
      return {
        success: false,
        error: "Passwords do not match",
      };
    }

    const result = await changePasswordService(token, newPassword);

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

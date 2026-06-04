"use client";

import { useState } from "react";
import PrimaryInput from "@/components/Inputs/PrimaryInputField";
import { PrimaryButton } from "@/components/Buttons/PrimaryButton";
import {
  changePasswordAction,
  verifyPasswordAction,
} from "@/actions/user.action";
type PasswordStep = "idle" | "verify" | "change" | "success";

export default function SecuritySettings() {
  const [passwordStep, setPasswordStep] = useState<PasswordStep>("idle");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetPasswordFlow = () => {
    setPasswordStep("idle");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrors({});
  };

  const handleVerify = () => {
    if (!currentPassword) {
      setErrors({ current: "Please enter your current password." });
      return;
    }
    setErrors({});
    setPasswordStep("change");
  };

  const handleSave = async () => {
    const errs: Record<string, string> = {};

    if (!currentPassword) errs.current = "Please enter your current password.";

    if (newPassword.length < 8) errs.new = "Must be at least 8 characters.";

    if (newPassword !== confirmPassword)
      errs.confirm = "Passwords do not match.";

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Verify current password
      const verifyResult = await verifyPasswordAction(currentPassword);

      if (!verifyResult.success) {
        setErrors({
          current: verifyResult.error || "Incorrect current password.",
        });
        return;
      }

      // Step 2: Change password using the verified token
      const token = verifyResult.token ?? "";
      const changeResult = await changePasswordAction(
        token,
        newPassword,
        confirmPassword,
      );

      if (!changeResult.success) {
        setErrors({
          new: changeResult.error || "Failed to update password.",
        });
        return;
      }

      setErrors({});
      setPasswordStep("success");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Security Settings</h2>
          <p className="text-sm text-gray-500">
            Password last changed 2 months ago
          </p>
        </div>
        {passwordStep === "idle" && (
          <button
            onClick={() => setPasswordStep("verify")}
            className="px-6 py-2 rounded-xl border border-indigo-600 text-indigo-600 hover:bg-indigo-50"
          >
            Change Password
          </button>
        )}
        {passwordStep === "success" && (
          <span className="text-sm text-green-600 font-medium">
            Password updated
          </span>
        )}
      </div>

      {passwordStep === "verify" && (
        <div className="flex flex-col gap-4">
          <PrimaryInput
            label="Current password"
            type="password"
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            isInvalid={!!errors.current}
            errorMessage={errors.current}
          />
          <div className="flex justify-end gap-3">
            <PrimaryButton
              type="button"
              variant="secondary"
              onClick={resetPasswordFlow}
            >
              Cancel
            </PrimaryButton>
            <PrimaryButton type="button" onClick={handleVerify}>
              Continue
            </PrimaryButton>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {passwordStep === "change" && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <PrimaryInput
              label="New password"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              isInvalid={!!errors.new}
              errorMessage={errors.new}
              className="flex-1"
            />
            <PrimaryInput
              label="Confirm new password"
              type="password"
              placeholder="Repeat new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              isInvalid={!!errors.confirm}
              errorMessage={errors.confirm}
              className="flex-1"
            />
          </div>
          <div className="flex justify-end gap-3">
            <PrimaryButton
              type="button"
              variant="secondary"
              onClick={resetPasswordFlow}
            >
              Cancel
            </PrimaryButton>
            <PrimaryButton
              type="button"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Password"}
            </PrimaryButton>
          </div>
        </div>
      )}

      {/* Success */}
      {passwordStep === "success" && (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-gray-500">
            Your password has been changed successfully.
          </p>
          <div className="flex justify-end">
            <PrimaryButton
              type="button"
              variant="secondary"
              onClick={resetPasswordFlow}
            >
              Done
            </PrimaryButton>
          </div>
        </div>
      )}
    </div>
  );
}

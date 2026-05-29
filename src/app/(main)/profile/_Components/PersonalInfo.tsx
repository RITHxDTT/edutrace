"use client";

import { useSession } from "next-auth/react";
import PrimaryInput from "@/components/Inputs/PrimaryInputField";
import PrimarySelect from "@/components/Selects/PrimarySelect";
import { SelectItem } from "@heroui/select";
import PrimaryDateInput from "@/components/DateField/PrimaryDateField";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileFormScehma } from "@/schemas/ProfileFormSchema";
import { PrimaryButton } from "@/components/Buttons/PrimaryButton";
import { useEffect, useState } from "react";
import { parseDate } from '@internationalized/date'

export default function PersonalInfo() {
  const { data: session } = useSession();
  const user = session?.user;

  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileFormScehma),
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      username: user?.username,
      gender: (user?.gender as "MALE" | "FEMALE" | undefined) ?? undefined,
      birthdate: user?.birthdate ? parseDate(user.birthdate) : undefined,
      address: user?.address,
    },
  });

  const onSubmit = async (data: any) => {

    setIsEditing(false);
  };

  const handleCancel = () => {
    reset({
      firstName: user?.firstName,
      lastName: user?.lastName,
      username: user?.username,
      gender: (user?.gender as "MALE" | "FEMALE" | undefined) ?? undefined,
      birthdate: user?.birthdate ? parseDate(user.birthdate) : undefined,
      address: user?.address,
    });
    setIsEditing(false);
  };

  useEffect(() => {
    if (!user) return;

    reset({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      gender: (user.gender as "MALE" | "FEMALE" | undefined) ?? undefined,
      birthdate: user.birthdate ? parseDate(user.birthdate) : undefined,
      address: user.address,
    });
  }, [user, reset]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col gap-6">
      <h2 className="text-lg font-semibold">Personal Information</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-6">

          {/* Left */}
          <div className="flex-1 space-y-4">
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <PrimaryInput
                  label="First Name"
                  type="text"
                  placeholder="First Name"
                  isDisabled={!isEditing}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  isInvalid={!!errors.firstName}
                  errorMessage={errors.firstName?.message}
                />
              )}
            />

            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <PrimaryInput
                  label="Last Name"
                  type="text"
                  placeholder="Last Name"
                  isDisabled={!isEditing}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  isInvalid={!!errors.lastName}
                  errorMessage={errors.lastName?.message}
                />
              )}
            />

            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <PrimaryInput
                  label="Username"
                  type="text"
                  placeholder="username"
                  isDisabled={!isEditing}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  isInvalid={!!errors.username}
                  errorMessage={errors.username?.message}
                />
              )}
            />
          </div>

          {/* Right */}
          <div className="flex-1 space-y-4">
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <PrimarySelect
                  label="Gender"
                  placeholder="Select Gender"
                  isDisabled={!isEditing}
                  selectedKeys={field.value ? [field.value] : []}
                  onSelectionChange={(keys) =>
                    field.onChange([...keys][0] ?? "")
                  }
                  isInvalid={!!errors.gender}
                  errorMessage={errors.gender?.message}
                >
                  <SelectItem key="MALE">Male</SelectItem>
                  <SelectItem key="FEMALE">Female</SelectItem>
                </PrimarySelect>
              )}
            />

            <PrimaryInput
              label="Address"
              type="text"
              placeholder="Enter your address..."
              isDisabled={!isEditing}
              {...register("address")}
              isInvalid={!!errors.address}
              errorMessage={errors.address?.message}
            />

            <Controller
              name="birthdate"
              control={control}
              render={({ field }) => (
                <PrimaryDateInput
                  label="Birth Date"
                  value={field.value}
                  onChange={field.onChange}
                  isDisabled={!isEditing}
                  isInvalid={!!errors.birthdate}
                  errorMessage={errors.birthdate?.message}
                />
              )}
            />
          </div>
        </div>

        {/* Profile Edit Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          {isEditing && (
            <PrimaryButton
              type="button"
              onClick={handleCancel}
              variant="secondary"
            >
              Cancel
            </PrimaryButton>
          )}
          {
            isEditing ? (
              <PrimaryButton
                type="submit"
                className="px-6 py-2"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </PrimaryButton>
            ) : (
              <PrimaryButton
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setIsEditing(true);
                }}
                className="px-6 py-2"
              >
                Edit Profile
              </PrimaryButton>
            )
          }

        </div>
      </form>
    </div>
  );
}
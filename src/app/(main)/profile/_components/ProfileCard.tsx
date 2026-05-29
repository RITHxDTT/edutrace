"use client";

import { useRef, useState } from "react";
import { Camera, User } from "iconsax-react";
<<<<<<< Updated upstream:src/app/(main)/profile/_components/ProfileCard.tsx
import { ClassSvg } from "../../assessment/[id]/_components/StudentWork/_components/ClassSvg";
=======
>>>>>>> Stashed changes:src/app/(main)/profile/_Components/ProfileCard.tsx
import { useSession } from "next-auth/react";
import Image from "next/image";
import { changeProfileImageAction } from "@/actions/user.action";
export default function ProfileCard() {
  const { data: session, update } = useSession();
  const user = session?.user;

  const [isOpen, setIsOpen] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const avatar = user?.profileImageUrl ? user.profileImageUrl : null;
  const classroomAbbrev = user?.classroomAbbre;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset error when a new image is picked
    setError(null);
    setSelectedFile(file);

    const imageUrl = URL.createObjectURL(file);
    setTempImage(imageUrl);
  };

  const handleSave = async () => {
    if (!selectedFile) {
      setError("Please select an image first.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await changeProfileImageAction(selectedFile);

      if (res && res.success) {
        if (tempImage) {
          URL.revokeObjectURL(tempImage);
        }

        await update({
          profileImageUrl: res.data.payload.resourceUrl
        });

        setIsOpen(false);
        setTempImage(null);
        setSelectedFile(null);
      } else {
        setError(res?.error || "Failed to update profile picture. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Upload error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setTempImage(null);
    setSelectedFile(null);
    setError(null);
  };

  return (
    <>
      {/* Blur Background Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
          <div className="w-[400px] bg-white rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-5">
              Update Profile Picture
            </h2>

            {/* Error Message UI Banner */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-center mb-6">
              <div className="w-36 h-36 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                {tempImage || avatar ? (
                  <Image
                    src={tempImage || avatar || ""}
                    alt="preview"
                    width={0}
                    height={0}
                    unoptimized
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={40} color="black" />
                )}
              </div>
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              disabled={isSubmitting}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting}
              className="w-full border rounded-xl py-3 hover:bg-gray-50 transition disabled:opacity-50"
            >
              Choose Image
            </button>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCancel}
                disabled={isSubmitting}
                className="flex-1 border rounded-xl py-3 hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={isSubmitting}
                className="flex-1 bg-indigo-600 text-white rounded-xl py-3 hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Card */}
      <div className="flex items-center gap-6 bg-white rounded-2xl shadow-sm border p-6">
        <div className="relative">
          <div className="w-35 h-35 rounded-full flex items-center justify-center bg-gray-100 text-gray-500 overflow-hidden">
            {avatar ? (
              <Image
                src={avatar}
                alt="avatar"
                width={0}
                height={0}
                className="w-full h-full object-cover"
                unoptimized
                loading="eager"
              />
            ) : (
              <User size={40} color="black" />
            )}
          </div>

          {/* Camera Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg hover:bg-accent-purple hover:text-white transition"
          >
            <Camera size={20} color="currentColor" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold">
            {user?.fullName}
          </h1>

          <p className="text-gray-500">{user?.email}</p>

          <div className="flex items-center gap-2 mt-2">
            {classroomAbbrev && (
              <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full">
              
                <span className="text-xs text-indigo-600">
                  Class {classroomAbbrev}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { User } from "iconsax-react";
import Image from "next/image";

export default function UserProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const user = session?.user;

  const fullName = user?.fullName;
  const email = user?.email;
  const avatar = user?.profileImageUrl ? user.profileImageUrl : null;

  const isLoading = status === "loading";

  return (
    <div
      className="flex gap-3 items-center rounded-lg p-2 cursor-pointer"
      onClick={() => router.push("/profile")}
    >
      {/* Avatar / Fallback Icon */}
      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-100 text-gray-500 overflow-hidden">
        {avatar ? (
          <Image
            src={avatar}
            width={0}
            height={0}
            alt="avatar"
            className="w-full h-full object-cover"
            unoptimized
            loading="eager"
          />
        ) : (
          <User size={26} color="black" />
        )}
      </div>

      {/* Name & Email */}
      <div className="hidden sm:flex flex-col leading-tight">
        <span className="text-sm font-semibold text-gray-800">
          {isLoading ? "Loading..." : fullName}
        </span>

        <span className="text-xs text-gray-500">
          {isLoading ? "Loading..." : email}
        </span>
      </div>
    </div>
  );
}
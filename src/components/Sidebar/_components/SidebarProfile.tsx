"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SidebarProfile() {
  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user;

  return (
    <div className="flex items-center gap-3">
      <div
        className="w-11 h-11 rounded-full border-2 border-transparent overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(white, white), var(--background-image-accent-linear-purple)",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
        }}
      >
        <button onClick={() => router.push("/profile")}>
          <Image
            src={user?.image || "/images/profile/fallback.webp"}
            alt="Profile"
            width={54}
            height={54}
            className="object-cover w-full h-full"
          />
        </button>
      </div>

      <div>
        <h3 className="font-semibold text-sm">{user?.firstName || "rith"}</h3>

        <p className="text-xs text-gray-500">{user?.email || "No Email"}</p>
      </div>
    </div>
  );
}

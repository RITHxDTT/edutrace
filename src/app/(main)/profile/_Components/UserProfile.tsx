"use client";
import React from "react";
// import useRouter from "next/navigation";
import { useRouter } from "next/navigation"; 
import {useSession} from "next-auth/react";

export default function UserProfile() {
    const {data: session} = useSession();
    const user = session?.user;
  const router = useRouter();

  return (
    <div className="border-1 flex flex-col items-center justify-center cursor-pointer" onClick={() => router.push("/profile")}>
      <div className="w-16 h-16  rounded-full bg-[url('/images/profile/fallback.webp')] bg-cover bg-center "></div>
      <span>{user?.firstName}</span>
      {/* <span>bunnarith</span> */}
    </div>
  );
}

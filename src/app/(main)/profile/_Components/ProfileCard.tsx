"use client";
import React from "react";
import { ClassSvg } from "./ClassSvg";
import {useSession} from "next-auth/react";

export default function ProfileCard() {
    const {data :session} = useSession();
    const user = session?.user;
  return (
    <div className="flex items-center gap-6 bg-white rounded-2xl shadow-sm border p-6">
      <img
        src="/images/profile/fallback.webp"
        alt="user"
        className="w-24 h-24 rounded-full object-cover border"
      />

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">{user?.firstName}</h1>
        <p className="text-gray-500">{user?.email}</p>

        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full">
            <ClassSvg />
            <span className="text-xs text-indigo-600">SR Class</span>
          </div>
        </div>
      </div>
    </div>
  );
}

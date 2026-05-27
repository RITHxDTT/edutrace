"use client";

import React from "react";
import { ClassSvg } from "./ClassSvg";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import PersonalInfor from "./PersonalInfor";
import ProfileCard from "./ProfileCard";

export default function ProfileFormClient() {
  return (
    <div className="w-full  mx-auto flex flex-col gap-6 p-6">
      {/* profile card */}
      <ProfileCard />

      {/* personal info */}
      <PersonalInfor/>

      {/* SECURITY */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Security Settings</h2>
          <p className="text-sm text-gray-500">
            Password last changed 2 months ago
          </p>
        </div>

        <button className="px-6 py-2 rounded-xl border border-indigo-600 text-indigo-600 hover:bg-indigo-50">
          Change Password
        </button>
      </div>
    </div>
  );
}

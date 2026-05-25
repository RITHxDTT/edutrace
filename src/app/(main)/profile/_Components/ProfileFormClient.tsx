"use client";

import React from "react";
import { ClassSvg } from "./ClassSvg";
import { Calendar } from "lucide-react";

export default function ProfileFormClient() {
  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 p-6">

      {/* PROFILE CARD */}
      <div className="flex items-center gap-6 bg-white rounded-2xl shadow-sm border p-6">
        <img
          src="/images/profile/fallback.webp"
          alt="user"
          className="w-24 h-24 rounded-full object-cover border"
        />

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold">Yung Bunnarith</h1>
          <p className="text-gray-500">yung.bunnarith@example.com</p>

          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full">
              <ClassSvg />
              <span className="text-xs text-indigo-600">SR Class</span>
            </div>
          </div>
        </div>
      </div>

      {/* PERSONAL INFORMATION */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col gap-6">

        <h2 className="text-lg font-semibold">Personal Information</h2>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* LEFT */}
          <div className="space-y-4">

            <div>
              <label className="text-sm text-gray-600">First Name</label>
              <input
                type="text"
                placeholder="Tan"
                className="w-full mt-1 px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-200 outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Last Name</label>
              <input
                type="text"
                placeholder="Dara"
                className="w-full mt-1 px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-200 outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Username</label>
              <input
                type="text"
                placeholder="tandara007"
                className="w-full mt-1 px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-200 outline-none"
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-4">

            <div>
              <label className="text-sm text-gray-600">Gender</label>
              <input
                type="text"
                placeholder="Male"
                className="w-full mt-1 px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-200 outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Address</label>
              <input
                type="text"
                placeholder="Phnom Penh, Cambodia"
                className="w-full mt-1 px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-200 outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Date of Birth</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="dd-mm-yyyy"
                  className="w-full mt-1 px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-200 outline-none pr-10"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* BUTTON */}
          <div className="md:col-span-2 flex justify-end pt-2">
            <button
              type="button"
              className="px-8 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              Edit
            </button>
          </div>

        </form>
      </div>

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
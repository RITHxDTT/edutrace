"use client";
import React from "react";
import { Calendar } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PersonalInfor() {
  const { data: session } = useSession();
  const user = session?.user;

  const inputStyles = "w-full mt-1 px-4 py-3 h-auto rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-200 outline-none";

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col gap-6">
      <h2 className="text-lg font-semibold">Personal Information</h2>

      <form className="flex flex-col gap-6">
        
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* left */}
          <div className="flex-1 space-y-4">
            <div>
              <label className="text-sm text-textColor">First Name</label>
              <Input
                type="text"
                placeholder="Tan"
                defaultValue={user?.firstName}
                className={inputStyles}
              />
            </div>

            <div>
              <label className="text-sm text-textColor">Last Name</label>
              <Input
                type="text"
                placeholder="Dara"
                defaultValue={user?.lastName}
                className={inputStyles}
              />
            </div>

            <div>
              <label className="text-sm text-textColor">Username</label>
              <Input
                type="text"
                placeholder="tandara007"
                defaultValue={user?.username}
                className={inputStyles}
              />
            </div>
          </div>

          {/* right */}
          <div className="flex-1 space-y-4">
            <div>
              <label className="text-sm text-textColor">Gender</label>
              <Input
                type="text"
                placeholder="Male"
                className={inputStyles}
              />
            </div>

            <div>
              <label className="text-sm text-textColor">Address</label>
              <Input
                type="text"
                placeholder="Phnom Penh, Cambodia"
                className={inputStyles}
              />
            </div>

            <div>
              <label className="text-sm text-textColor">Date of Birth</label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="dd-mm-yyyy"
                  className={`${inputStyles} pr-10`}
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

        </div>

        {/* Button Row */}
        <div className="flex justify-end pt-2">
          <Button
            type="button"
            className="px-8 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            Edit
          </Button>
        </div>
      </form>
    </div>
  );
}
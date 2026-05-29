"use client";

import PersonalInfo from "./PersonalInfo";
import ProfileCard from "./ProfileCard";
import SecuritySettings from "./SecuritySettings";

export default function ProfileFormClient() {
  return (
    <div className="w-full mx-auto flex flex-col gap-6 p-6">
      <ProfileCard />
      <PersonalInfo />
      <SecuritySettings />
    </div>
  );
}
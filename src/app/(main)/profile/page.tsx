import { redirect } from "next/navigation";
import ProfileFormClient from "./_components/ProfileFormClient";
import NavbarTitle from "@/components/Topbar/NavbarTitle";

export default async function ProfilePage() {
  return (
    <div >

      <NavbarTitle title="Profile" override />
      <ProfileFormClient />
    </div>

  );
}
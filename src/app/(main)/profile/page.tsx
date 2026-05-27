import { redirect } from "next/navigation";
import ProfileFormClient from "./_Components/ProfileFormClient";
import NavbarTitle from "@/components/Topbar/NavbarTitle";

export default async function ProfilePage() {
  
  const mockSession = {
    user: {
      name: "Tan Dara",
      email: "tandara@gmail.com",
      image: "/default-avatar.png", 
    },
  };

  
  const isLoggedIn = true; 

  if (!isLoggedIn || !mockSession?.user) {
    redirect("/login");
  }

  
  const initialData = {
    firstName: mockSession.user.name?.split(" ")[0] || "",
    lastName: mockSession.user.name?.split(" ").slice(1).join(" ") || "",
    email: mockSession.user.email || "",
    image: mockSession.user.image || "/default-avatar.png",
    username: "hengchakriya007", 
    gender: "Female",
    address: "tandara007", 
    dob: "2000-04-12",
  };

  return (
    <div >
        {/* <ProfileFormClient initialData={initialData} /> */}
        <NavbarTitle title="Dashbord" override />
        <ProfileFormClient />
      </div>
    
  );
}
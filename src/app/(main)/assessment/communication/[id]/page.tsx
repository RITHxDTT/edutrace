import { auth } from "@/auth";
import NavbarTitle from "@/components/Topbar/NavbarTitle";
import CommunicationRoom from "./_components/CommunicationRoom";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await auth();

  return (
    <>
      <NavbarTitle title="Communication Room" override />
      <CommunicationRoom meetingRoomId={id} />
    </>
  );
}

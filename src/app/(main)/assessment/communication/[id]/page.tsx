import CommunicationRoom from "./_components/CommunicationRoom";

type CommunicationPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CommunicationPage({
  params,
}: CommunicationPageProps) {
  const { id } = await params;

  return <CommunicationRoom meetingRoomId={id} />;
}

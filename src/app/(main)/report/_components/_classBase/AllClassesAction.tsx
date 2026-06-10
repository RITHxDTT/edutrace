"use client";

import { useRouter } from "next/navigation";
import { PrimaryButton } from "@/components/Buttons/PrimaryButton";

interface AllClassesActionsProps {
  reportId: string;
}

export default function AllClassesActions({
  reportId,
}: AllClassesActionsProps) {
  const router = useRouter();

  const handleExport = () => {
    window.open(`/api/export-pdf?reportId=${reportId}`, "_blank");
  };

  return (
    <div className="flex items-center gap-1">
      <PrimaryButton onClick={() => router.push("/report")}>Back</PrimaryButton>

      <PrimaryButton onClick={handleExport}>Export PDF</PrimaryButton>
    </div>
  );
}

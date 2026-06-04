"use client";

import { useRouter } from "next/navigation";
import { PrimaryButton } from "@/components/Buttons/PrimaryButton";

export default function TaskBasedActions() {
  const router = useRouter();
  return (
    <div className="flex items-center gap-1">
      <PrimaryButton onClick={() => router.push("/report")}>Back</PrimaryButton>
      <PrimaryButton
        onClick={() =>
          window.open("/report/api/export-pdf?path=/report/taskbased", "_blank")
        }
      >
        Export PDF
      </PrimaryButton>
    </div>
  );
}

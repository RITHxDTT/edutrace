"use client";

import { PrimaryButton } from "@/components/Buttons/PrimaryButton";

interface TaskBasedActionsProps {
  reportId: string;
}

export default function TaskBasedActions({ reportId }: TaskBasedActionsProps) {
  const handleExportPDF = () => {
    if (!reportId || reportId === "undefined" || reportId === "null") {
      console.error("Export Error: reportId is missing or invalid");
      return;
    }
    window.open(`/api/export-pdf?reportId=${reportId}`, "_blank");
  };

  return (
    <div className="flex items-center gap-3">
      <PrimaryButton onClick={handleExportPDF}>Export PDF</PrimaryButton>
    </div>
  );
}

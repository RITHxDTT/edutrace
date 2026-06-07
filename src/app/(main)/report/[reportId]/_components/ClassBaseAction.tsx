"use client";

import { PrimaryButton } from "@/components/Buttons/PrimaryButton";

interface AllClassesActionsProps {
  reportId: string;
}

export default function AllClassesActions({
  reportId,
}: AllClassesActionsProps) {
  const handleExportPDF = () => {
    if (!reportId || reportId === "undefined" || reportId === "null") {
      console.error("Export Error: reportId is missing or invalid");
      return;
    }
    window.open(`/api/export-pdf?reportId=${reportId}`, "_blank");
  };

  return <PrimaryButton onClick={handleExportPDF}>Export PDF</PrimaryButton>;
}

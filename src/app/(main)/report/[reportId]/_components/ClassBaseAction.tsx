"use client";

import { usePathname } from "next/navigation";
import { Download } from "lucide-react";
import { PrimaryButton } from "@/components/Buttons/PrimaryButton"; 

export default function AllClassesActions() {
  const pathname = usePathname();

  const handleExportPDF = () => {
    window.open(`/api/generate-pdf?path=${encodeURIComponent(pathname)}`, '_blank');
  };

  return (
    <div className="flex items-center gap-3">
      

      <PrimaryButton onClick={handleExportPDF}>
        <Download size={18} className="mr-2 inline" />
        Export PDF
      </PrimaryButton>
    </div>
  );
}
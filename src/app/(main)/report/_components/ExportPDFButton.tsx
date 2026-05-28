"use client";

export default function ExportPdfButton() {
  const handleExport = () => {
    window.open("/api/export-pdf", "_blank");
  };

  return (
    <button
      onClick={handleExport}
      className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
    >
      Export PDF
    </button>
  );
}

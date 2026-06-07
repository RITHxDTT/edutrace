"use client";

export default function ExportPdfButton({ reportId }: { reportId: string }) {
  const handleExport = () => {
    // window.open(`/api/export-pdf?reportId=${reportId}`, "_blank");
    window.print();
  };

  return (
    <button
      onClick={handleExport}
      className="bg-purple-600 text-white px-4 py-2 rounded-lg"
    >
      Export PDF
    </button>
  );
}

"use client";

export default function PdfReportWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div id="pdf-report" data-pdf-mode="true" className="bg-white w-full">
      {children}
    </div>
  );
}

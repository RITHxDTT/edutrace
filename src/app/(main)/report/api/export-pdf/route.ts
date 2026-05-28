import { NextRequest } from "next/server";
import puppeteer from "puppeteer";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const path = searchParams.get("path") ?? "/report/allclasses";

  const targetUrl = `${origin}${path}`;

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await page.goto(targetUrl, { waitUntil: "networkidle0", timeout: 30000 });

    // Allow time for MUI charts and dynamic imports to fully render
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Directly hide navigation chrome — more reliable than @media print
    // because Tailwind's md:block still fires at 1440 px even in print mode.
    await page.addStyleTag({
      content: `
        [data-slot="sidebar"],
        [data-slot="sidebar-container"],
        header {
          display: none !important;
        }
        .absolute.inset-0 {
          display: none !important;
        }
      `,
    });

    const reportName = path.includes("taskbased")
      ? "taskbased-report"
      : "allclasses-report";

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      landscape: true,
      margin: { top: "16px", right: "16px", bottom: "16px", left: "16px" },
    });

    // page.pdf() returns Uint8Array<ArrayBufferLike>; slice to a plain ArrayBuffer for Blob
    const ab = (pdf.buffer as ArrayBuffer).slice(pdf.byteOffset, pdf.byteOffset + pdf.byteLength);
    const blob = new Blob([ab], { type: "application/pdf" });
    return new Response(blob, {
      headers: {
        "Content-Disposition": `attachment; filename="${reportName}.pdf"`,
      },
    });
  } finally {
    await browser.close();
  }
}

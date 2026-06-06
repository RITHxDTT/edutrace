
import { NextRequest } from "next/server";
import puppeteer from "puppeteer";

import { auth } from "@/auth";
import { generatePdfToken } from "@/lib/pdf-token.ts";
export async function GET(request: NextRequest) {
  
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { searchParams, origin } = request.nextUrl;
  const reportId = searchParams.get("reportId");

  if (!reportId) {
    return Response.json({ error: "Missing reportId" }, { status: 400 });
  }

  
  const expiry = Date.now() + 60000;
  const secureToken = generatePdfToken(reportId, expiry);

  
  const targetUrl = `${origin}/report/print/${reportId}?token=${secureToken}&expires=${expiry}`;

  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    });

    const page = await browser.newPage();

    
    await page.setViewport({
      width: 2280,
      height: 2000,
      deviceScaleFactor: 2,
    });

    
    await page.goto(targetUrl, {
      waitUntil: "networkidle0",
      timeout: 60000,
    });

    await page.waitForSelector("#pdf-report", {
      timeout: 60000,
    });

    await page.emulateMediaType("screen");

    
    await page.addStyleTag({
      content: `
        header, nav, aside, .fixed, button, [role="button"], .hide-in-pdf {
          display: none !important;
        }
        body {
          background: white !important;
        }
        #pdf-report {
          width: 100% !important;
          padding: 0 !important;
        }
        .break-inside-avoid {
          break-inside: avoid;
          page-break-inside: avoid;
        }
      `,
    });

    const pdf = await page.pdf({
      format: "A4",
      landscape: true,
      printBackground: true,
      margin: {
        top: "15mm",
        bottom: "15mm",
        left: "15mm",
        right: "15mm",
      },
    });

    return new Response(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="report-${reportId}.pdf"`,
      },
    });
  } catch (err) {
    console.error("Puppeteer Export Error Pipeline:", err);
    return Response.json(
      { error: "PDF Generation Failed internal catch block" },
      { status: 500 },
    );
  } finally {
    if (browser) await browser.close();
  }
}

import { NextRequest } from "next/server";
import puppeteer from "puppeteer";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  
  const session = await auth();
  if (!session || !session.access_token) {
    return Response.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { searchParams, origin } = request.nextUrl;
  const reportId = searchParams.get("reportId");

  if (!reportId || reportId === "undefined" || reportId === "null") {
    return Response.json(
      { error: "Invalid or missing reportId parameter" },
      { status: 400 },
    );
  }

  
  const targetUrl = `${origin}/report/print/${reportId}?token=${session.access_token}`;
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

    
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const url = req.url();
      if (
        url.includes("knocklabs") ||
        url.includes("analytics") ||
        url.includes("mixpanel") ||
        req.resourceType() === "websocket"
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.setViewport({
      width: 1440,
      height: 2000,
      deviceScaleFactor: 2,
    });

    console.log(
      "NAVIGATING PUPPETEER TO SEED PAGE:",
      `${origin}/report/print/${reportId}`,
    );

    await page.goto(targetUrl, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    
    await page.waitForSelector("#pdf-report", { timeout: 15000 });
    console.log("PDF CONTAINER DETECTED SUCCESSFULLY");

    
    await page.evaluate(
      () => new Promise((resolve) => setTimeout(resolve, 2500)),
    );

    await page.emulateMediaType("screen");

    await page.addStyleTag({
      content: `
        @page { size: A4; margin: 10mm; }
        html, body { margin: 0; padding: 0; background: white; }
        header, nav, aside, button, .fixed, .hide-in-pdf, .print\\:hidden { display: none !important; }
        #pdf-report { width: 100% !important; overflow: visible !important; }
        .break-inside-avoid { break-inside: avoid; page-break-inside: avoid; }
        canvas, svg { max-width: 100% !important; }
      `,
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "10mm", bottom: "10mm", left: "10mm", right: "10mm" },
    });

    return new Response(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="report-${reportId}.pdf"`,
      },
    });
  } catch (err) {
    console.error("EXPORT PDF EXCEPTION:", err);
    return Response.json({ error: "PDF Generation Failed" }, { status: 500 });
  } finally {
    if (browser) await browser.close();
  }
}

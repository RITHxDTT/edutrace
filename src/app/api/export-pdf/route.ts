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
      { error: "Invalid or missing reportId" },
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
        "--font-render-hinting=none",
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
      width: 1400,
      height: 1000,
      deviceScaleFactor: 2,
    });

    console.log("PUPPETEER LOADING TARGET REPORT URL...");

    await page.goto(targetUrl, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    await page.waitForSelector("#pdf-report", { timeout: 15000 });

    await page.addStyleTag({
      content: `

html,
body{
  background:#f6f3ff !important;
  margin:0 !important;

  -webkit-print-color-adjust:exact !important;
  print-color-adjust:exact !important;
}

*{
  -webkit-print-color-adjust:exact !important;
  print-color-adjust:exact !important;
  box-sizing:border-box;
}

#pdf-report{
  background:#f6f3ff !important;

  min-height:100vh;

  padding:24px !important;
}

/* Hide unwanted stuff */

header,
nav,
aside,
button,
.fixed,
.hide-in-pdf,
.print\\:hidden{
 display:none !important;
}


/* smoother card appearance */

.rounded-2xl{
 box-shadow:
  0 1px 3px rgba(0,0,0,.04),
  0 8px 20px rgba(0,0,0,.03) !important;
}

/* charts */

canvas,
svg{
 max-width:100% !important;
}

`,
    });

    await page.evaluate(
      () => new Promise((resolve) => setTimeout(resolve, 2500)),
    );

    await page.emulateMediaType("screen");

    console.log("GENERATING ARTIFACT PDF BUFFER...");

    const pdf = await page.pdf({
      format: "A4",

      printBackground: true,

      preferCSSPageSize: true,

      margin: {
        top: "0mm",
        bottom: "0mm",
        left: "8mm",
        right: "8mm",
      },
    });

    console.log("PDF BUFFER COMPILED SUCCESSFUL");
    return new Response(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="report-${reportId}.pdf"`,
      },
    });
  } catch (err) {
    console.error("PDF PRODUCTION FAULT CRASH:", err);
    return Response.json({ error: "PDF Generation Failed" }, { status: 500 });
  } finally {
    if (browser) await browser.close();
  }
}

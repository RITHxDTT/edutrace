import { NextRequest } from "next/server";
import puppeteer from "puppeteer";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;

  const reportId = searchParams.get("reportId");

  if (!reportId) {
    return Response.json(
      {
        error: "Missing reportId",
      },
      {
        status: 400,
      },
    );
  }

  const targetUrl = `${origin}/report/export/${reportId}?pdf=true`;

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
      width: 1600,

      height: 1200,

      deviceScaleFactor: 2,
    });

    await page.goto(targetUrl, {
      waitUntil: "networkidle0",

      timeout: 120000,
    });

   

    await page.waitForSelector("#pdf-report", {
      timeout: 120000,
    });

    await page.emulateMediaType("screen");

   

    await page.addStyleTag({
      content: `

      header,
      nav,
      aside,
      .hide-in-pdf {

        display:none !important;

      }

      body{

        background:white !important;

      }

      #pdf-report{

        width:100%;

      }

      .break-inside-avoid{

        break-inside:avoid;

        page-break-inside:avoid;

      }

      `,
    });

    const pdf = await page.pdf({
      format: "A4",

      landscape: true,

      printBackground: true,

      preferCSSPageSize: true,

      margin: {
        top: "10mm",

        bottom: "10mm",

        left: "10mm",

        right: "10mm",
      },
    });

    return new Response(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",

        "Content-Disposition": `attachment; filename="report-${reportId}.pdf"`,
      },
    });
  } catch (err) {
    console.error(err);

    return Response.json(
      {
        error: "PDF Failed",
      },

      {
        status: 500,
      },
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

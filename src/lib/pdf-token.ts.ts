
import { createHmac, timingSafeEqual } from "crypto";


const PDF_SECRET = process.env.PDF_EXPORT_SECRET || "fallback-super-secure-long-string-key-32chars";

export function generatePdfToken(reportId: string, expiryTimestamp: number): string {
  const data = `${reportId}:${expiryTimestamp}`;
  return createHmac("sha256", PDF_SECRET).update(data).digest("hex");
}

export function verifyPdfToken(reportId: string, token: string, expiryStr: string | null): boolean {
  if (!expiryStr || !token) return false;
  
  const expiry = parseInt(expiryStr, 10);
  if (Date.now() > expiry) return false;

  const expectedToken = generatePdfToken(reportId, expiry);
  
  
  return timingSafeEqual(Buffer.from(token), Buffer.from(expectedToken));
}
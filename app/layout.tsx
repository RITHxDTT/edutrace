import type { Metadata } from "next";
import { Fredoka, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka-sans",
})

export const metadata: Metadata = {
  title: "HRDRoom - Home",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", fredoka.variable)}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "../styles/globals.css";
import { cn } from "@/lib/utils";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/Sidebar/AppSidebar";
import AppNavbar from "@/components/Topbar/AppNavbar";

const fredoka = Fredoka({
  variable: "--font-fredoka-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Growthyflow - Landing",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        fredoka.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <div className="absolute inset-0 bg-main-img bg-cover bg-center" />
        <div className="absolute inset-0 bg-[#F4F7FE]/70" />
        <div className="relative z-10 flex flex-1">
          <SidebarProvider>
            <AppSidebar />
            <div className="flex flex-col flex-1">
              <AppNavbar />
              <main className="h-full px-5 py-5">{children}</main>
            </div>
          </SidebarProvider>
        </div>
      </body>
    </html>
  );
}
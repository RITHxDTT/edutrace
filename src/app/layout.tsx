import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "../styles/globals.css";
import { cn } from "@/lib/utils";
import { HeroUIProvider } from "@heroui/system";


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
                <HeroUIProvider>
                    <main className="flex-1">{children}</main>
                </HeroUIProvider>
            </body>
        </html>
    );
}
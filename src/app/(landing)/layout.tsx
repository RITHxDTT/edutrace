import type { Metadata } from "next";
import '../../styles/globals.css';
import Providers from "@/app/providers";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Edutrace - Landing",
};


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Providers>
        <div className="flex flex-col flex-1">
          <Navbar />
          <main className="flex-1">{children}</main>
        </div>
      </Providers>
    </>
  )
}

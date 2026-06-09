import type { Metadata } from "next";
import '../../styles/globals.css';
import Providers from "@/app/providers";

export const metadata: Metadata = {
  title: "Edutrace - Landing",
};


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Providers>
        <div className="flex flex-col flex-1">
          <main className="flex-1">{children}</main>
        </div>
      </Providers>
    </>
  )
}

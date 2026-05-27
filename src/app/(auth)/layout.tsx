import type { Metadata } from "next";
import '../../styles/globals.css';
import LogoComponent from "./_components/Logo";
import RightSideCover from "./_components/RightSideComponent";
import { Toaster } from 'sileo'

export const metadata: Metadata = {
  title: "Edutrace",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative flex flex-col min-h-screen">
      <Toaster position="top-center" />
      <LogoComponent />
      <main className="flex flex-1 overflow-clip">
        {children}
        <RightSideCover />
      </main>
    </div>
  );
}
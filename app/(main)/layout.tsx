import AppNavbar from '@/_components/navbar/AppNavbar'
import AppSidebar from '@/_components/navbar/AppSidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Fredoka } from 'next/font/google'
import React from 'react'
import "../globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka-sans",
  display: "swap",
})
export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider className='bg-accent-ice'>
      <AppSidebar />

      <div className="w-full flex flex-col min-h-screen">
        <header>
          <div className='flex items-center px-4 md:hidden'>
            <SidebarTrigger />
          </div>
          <AppNavbar />

        </header>

        <main className={`flex-1 ${fredoka.variable}`}>
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}

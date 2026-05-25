import AppSidebar from '@/components/Sidebar/AppSidebar'
import AppNavbar from '@/components/Topbar/AppNavbar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { NavbarProvider } from '@/context/NavbarContext'
import { SessionProvider } from 'next-auth/react'
import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="absolute inset-0 bg-main-img bg-cover bg-center" />
      <div className="absolute inset-0 bg-[#F4F7FE]/70" />
      <div className="relative z-10 flex flex-1">
        <SessionProvider>
        <SidebarProvider>
          <NavbarProvider>
            <AppSidebar />
            <div className="flex flex-col flex-1">
              <AppNavbar />
              <main className="px-5 py-5 flex-1">{children}</main>
            </div>
          </NavbarProvider>
        </SidebarProvider>
        </SessionProvider>
      </div>
    </>
  )
}

import AppSidebar from '@/components/Sidebar/AppSidebar'
import AppNavbar from '@/components/Topbar/AppNavbar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { NavbarProvider } from '@/context/NavbarContext'
import { SessionProvider } from 'next-auth/react'
import KnockProviderWrapper from '@/components/notifications/KnockProviderWrapper'
import { Toaster } from 'sileo'
import React from 'react'


export default async function Layout({ children }: { children: React.ReactNode }) {

  return (
    <>
      <Toaster position="top-center" />
      <div className="fixed inset-0 bg-main-img bg-cover bg-center" />
      <div className="fixed inset-0 bg-[#F4F7FE]/70" />
      <div className="relative z-10 flex flex-1">
        <SessionProvider>
          <KnockProviderWrapper>
            <SidebarProvider>
              <NavbarProvider>
                <AppSidebar />
                <div className="flex flex-col flex-1 min-h-screen">
                  <AppNavbar />
                  <main className="flex-1 overflow-y-auto px-5 py-5">
                    {children}
                  </main>
                </div>
              </NavbarProvider>
            </SidebarProvider>
          </KnockProviderWrapper>
        </SessionProvider>
      </div>
    </>
  )
}

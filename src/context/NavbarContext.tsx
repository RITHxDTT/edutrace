"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getRoute } from "@/utils/getRouteLabel";

type NavbarContextType = {
  title: string;
  setTitle: (value: string, override?: boolean) => void;
  isSticky: boolean;
};

const NavbarContext = createContext<NavbarContextType | null>(null);

export function NavbarProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const route = getRoute(pathname)?.label;

  const [title, setTitleState] = useState(route ?? "Not Found");
  const [locked, setLocked] = useState(false);

  // Not sticky on /assessment/:id (detail page only — not list, not sub-routes)
  const isSticky = !/^\/assessment\/[^/]+$/.test(pathname);

  const setTitle = (value: string, override = false) => {
    if (override) {
      setLocked(true);
    }
    setTitleState(value);
  };

  useEffect(() => {
    if (locked) return;
  }, [route, locked]);

  useEffect(() => {
    setLocked(false);
  }, [pathname]);

  return (
    <NavbarContext.Provider value={{ title, setTitle, isSticky }}>
      {children}
    </NavbarContext.Provider>
  );
}

export function useNavbar() {
  const ctx = useContext(NavbarContext);
  if (!ctx) throw new Error("useNavbar must be used inside provider");
  return ctx;
}
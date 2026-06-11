"use client";

import { useSearchParams } from "next/navigation";

export function usePdfMode() {
  const searchParams = useSearchParams();
  return searchParams.get("pdf") === "true";
}
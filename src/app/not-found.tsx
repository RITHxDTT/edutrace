"use client"; 

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; 
import React from "react";

export default function NotFound() {
  const router = useRouter(); 

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-[url("/images/pageNotFound/bg.png")] bg-cover bg-center'>
      <div className="flex flex-col gap-5 items-center justify-center ">
        <h1 className="bg-accent-linear-purple bg-clip-text text-transparent font-[600] text-[200px]">
          404
        </h1>
        <p className="text-[48px] font-medium">OOOps!</p>
        <p className="text-[48px] font-medium">Page Not Found</p>
        <p className="text-[18px] font-normal text-textColor">
          This page doesn't exist or was removed!
        </p>
        <p className="text-[18px] font-normal text-textColor">
          We suggest you go back to the homepage.
        </p>
        <Button
          type="button"
          onClick={() => router.back()}
          className="w-[200px] h-[48px] hover:cursor-pointer px-8 py-2.5 rounded-xl bg-accent-linear-purple text-white hover:bg-indigo-700 transition"
        >
          Back to previous page
        </Button>
      </div>
    </div>
  );
}
"use client"
import Image from "next/image"

export default function LogoComponent() {
  return (

    <div className="flex items-center mt-[-40] ml-[-30]">
      <Image
        src="/images/logo/growthyFlowLogo.png"
        alt="GrowthyFlow Logo"
        width={0}
        height={0}
        priority
        unoptimized
        className="w-62.5 h-17.5 object-contain"
      />
    </div>

  )
}
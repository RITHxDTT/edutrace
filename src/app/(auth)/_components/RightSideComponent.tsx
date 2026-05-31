"use client"

import Image from "next/image"

export default function RightSideCover() {
  return (
    <div className="absolute right-0 w-1/2 h-screen overflow-hidden">
      
      {/* Background */}
      <div className="relative w-full h-full">
        <Image
          src="/images/background/bgAuth.png"
          alt="Background"
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />

        {/* Overlay Content */}
        <div className="relative z-10 flex h-full items-center justify-center p-8 xl:p-16">
          <div className="max-w-md text-white">
            <h2 className="text-4xl xl:text-7xl font-bold mb-4">
              Endutrace
            </h2>

            <p className="text-lg xl:text-xl leading-relaxed">
              A Unified Assignment and
              <br />
              Online Collaboration Hub
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
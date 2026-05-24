"use client"

export default function LeftSideCover() {
  return (
    <div className="hidden lg:flex relative w-[55%] items-center justify-center p-16 bg-white">

      <div
        className="absolute inset-0 bg-cover bg-right bg-no-repeat "
        style={{ backgroundImage: "url('/images/background/bgAuth.png')" }}
      />

      <div className="relative z-10 text-bg-white max-w-lg text-left ml-24">
        <h2 className="text-6xl font-bold tracking-tight mb-4 text-white">GrowthyFlow</h2>
        <p className="text-xl text-white/80 leading-relaxed font-light">
          A Unified Assignment and <br />Online Collaboration Hub
        </p>
      </div>
    </div>
  )
}
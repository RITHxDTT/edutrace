import Image from "next/image"

export default function LogoComponent() {
  return (
    <div className="flex items-center px-8">
      <Image
        src="/images/logo/growthyFlowLogo.png"
        alt="GrowthyFlow Logo"
        width={150}
        height={50}
        priority
        className="object-contain"
      />
    </div>
  )
}
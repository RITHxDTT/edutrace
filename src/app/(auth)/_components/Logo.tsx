import Image from "next/image"

export default function LogoComponent() {
  return (
    <div className="flex items-center px-8">
      <Image
        src="/images/logo/edutraceLogo.png"
        alt="GrowthyFlow Logo"
        width={100}
        height={50}
        priority
        className="object-contain absolute top-2"
      />
    </div>
  )
}
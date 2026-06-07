import Image from "next/image"

export default function LogoComponent() {
  return (
    <div className="flex items-center px-5 py-3 xl:absolute xl:top-3 xl:left-0 xl:px-8 xl:py-0 xl:z-10">
      <Image
        src="/images/logo/edutraceLogo.png"
        alt="EduTrace Logo"
        width={100}
        height={50}
        priority
        className="object-contain w-[72px] h-auto xl:w-[100px]"
      />
    </div>
  )
}
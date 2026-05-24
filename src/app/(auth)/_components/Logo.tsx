"use client"
import Image from "next/image"

<<<<<<< HEAD
export default function LogoComponent (){
    return(
        
            <div className="flex items-center  ml-[-30]">
                      <Image 
                        src="/images/logo/growthyFlowLogo.png" 
                        alt="GrowthyFlow Logo" 
                        width={150} 
                        height={20} 
                        priority
                        className="object-contain " 
                      />
                    </div>
        
    )
=======
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
>>>>>>> 19e13e2 (Authentication: Login done)
}
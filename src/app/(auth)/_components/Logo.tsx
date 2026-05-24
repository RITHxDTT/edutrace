"use client"
import Image from "next/image"

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 38fb47e8c43b3fe32324f3fe739c808240018f30
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
<<<<<<< HEAD
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
=======
>>>>>>> 38fb47e8c43b3fe32324f3fe739c808240018f30
}
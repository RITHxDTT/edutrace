"use client"
import Image from "next/image"

export default function LogoComponent (){
    return(
        
            <div className="flex items-center mt-[-40] ml-[-30]">
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
}
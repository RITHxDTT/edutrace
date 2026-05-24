import React from 'react';
import Image from 'next/image';

const UserConnection = ({ 
  avatars = [
    '/images/landingpage/piseth.jpg',
    '/images/landingpage/piseth.jpg',
    '/images/landingpage/piseth.jpg',
  ],
  text = "Helping students stay connected with instructors"
}) => {
  return (
    <div className=" flex flex-row items-center p-[15px_20px] gap-[26px] relative w-[540px] h-[120px] bg-white shadow-[0px_0px_15px_5px_rgba(0,0,0,0.1)] rounded-[25px]">
      
      
      <div className="flex flex-row items-center w-[268px] h-[94px] shrink-0">
        
        
        <div className="flex flex-row items-center w-[212px] h-[94px] shrink-0 isolations">
          {avatars.slice(0, 3).map((src, index) => (
            <div 
              key={index} 
              className="relative w-[94px] h-[94px] rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm"
              style={{
                marginLeft: index === 0 ? '0px' : '-35px',
                zIndex: index
              }}
            >
              <Image 
                src={src} 
                alt={`User avatar ${index + 1}`} 
                fill
                sizes="94px"
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        {/* green btn */}
        <div className="relative w-[72px] h-[74px] shrink-0 -ml-[16px] z-10">
          
          <div className="absolute w-[60px] h-[60px] left-[4px] top-[7px] bg-[#38C346] rounded-full flex items-center justify-center shadow-sm">
            
            <span className="font-['Poppins'] font-[275] text-[64px] leading-[96px] text-white select-none translate-y-[-4px]">
              +
            </span>
          </div>
        </div>

      </div>

      
      <p className="font-['Fredoka'] font-normal text-[18px] line-clamp-3 leading-[22px] text-black w-[213px] h-[66px] text-left shrink-0 flex items-center">
        {text}
      </p>
    </div>
  );
};

export default UserConnection;
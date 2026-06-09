import React from 'react';

const cardData = [
  {
    title: "Instructor Access",
    desc: "Simplify how you reach out for guidance with integrated tools that keep you and your teachers.",
    iconBg: "bg-[#F3FFF6]",
    iconSrc: "/images/landingpage/message.png" 
  },
  {
    title: "Peer Support",
    desc: "Connect with classmates to share resources and tackle complex assignments as a team.",
    iconBg: "bg-[#E9F6FF]",
    
    iconSrc: "/images/landingpage/meeting.png"
  },
  {
    title: "Progress Tracking",
    desc: "Stay ahead of your curriculum with real-time insights into your tasks and upcoming milestones.",
    iconBg: "bg-[#FFF9E9]",
    
    iconSrc: "/images/landingpage/calendar.png"
  }
];

export default function FeatureCards() {
  return (
    <section className="w-full max-w-[1254px] flex flex-col items-center gap-12 mt-20 px-4">
      
      {/* Changed from 'flex' to 'grid' to prevent horizontal squeezing distortion */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
        {cardData.map((card, idx) => (
          <div key={idx} className="flex flex-col items-center justify-center p-5 bg-white rounded-[20px] h-[213px] shadow-[0px_0px_5px_rgba(0,0,0,0.1)] hover:shadow-md transition-shadow text-center gap-2.5">
            
            {/* Added 'shrink-0' to explicitly prevent the circle from distorting */}
            <div className={`w-16 h-16 rounded-full flex items-center justify-center   ${card.iconBg} `}>
              <img 
                src={card.iconSrc} 
                alt={`${card.title} icon`} 
                className="w-6 h-6 object-contain" 
              />
            </div>
            
            <h3 className="font-['Fredoka'] font-medium text-[24px] text-[#3E3E3E] mt-2">
              {card.title}
            </h3>
            <p className="font-['Inter'] font-normal text-[14px] leading-[20px] text-[#717171] max-w-[320px]">
              {card.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
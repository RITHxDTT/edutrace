import React from 'react';

const ScanToLoginCard = () => {
  const qrCodeUrl = "/images/landingpage/qr.png";

  return (
    <div className="w-[55%] absolute bottom-4 left-4 right-4 z-10 flex items-center gap-4 bg-white/20 backdrop-blur-md border border-white/30 p-4 rounded-2xl shadow-2xl">
      
      <div className="bg-white p-1 rounded-xl flex-shrink-0 shadow-sm ">
        <img 
          src={qrCodeUrl} 
          alt="QR Code" 
          className="w-20 h-20 object-contain"
        />
      </div>

      
      <div className="text-white text-left font-sans">
        <h2 className="text-xl font-semibold mb-1 tracking-wide drop-shadow-sm">
          Scan to login
        </h2>
        <p className="text-white/90 text-xs leading-tight drop-shadow-sm">
          Easy to login by just scanning this QR code from your phone
        </p>
      </div>
    </div>
  );
};

export default ScanToLoginCard;
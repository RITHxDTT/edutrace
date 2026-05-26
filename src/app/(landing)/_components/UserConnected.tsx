import React from 'react';
import Image from 'next/image';

const UserConnection = ({
  avatars = [
    '/images/landingpage/piseth.jpg',
    '/images/landingpage/piseth.jpg',
    '/images/landingpage/piseth.jpg',
  ],
  text = 'Helping students stay connected with instructors',
}) => {
  return (
    <div className="relative flex h-28 w-full max-w-xl items-center gap-6 rounded-3xl bg-white p-4 shadow-lg">

      {/* Avatars */}
      <div className="flex items-center">
        {avatars.slice(0, 3).map((src, index) => (
          <div
            key={index}
            className={`relative h-20 w-20 overflow-hidden rounded-full border-2 border-white shadow-sm ${index !== 0 ? '-ml-8' : ''
              }`}
            style={{ zIndex: index }}
          >
            <Image
              src={src}
              alt={`User avatar ${index + 1}`}
              fill
              className="object-cover"
              sizes="80px"
              priority={index === 0}
            />
          </div>
        ))}

        {/* Plus Button */}
        <div className="-ml-4 z-10 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 shadow-sm">
          <span className="text-5xl font-light leading-none text-white">
            +
          </span>
        </div>
      </div>

      {/* Text */}
      <p className="line-clamp-3 max-w-xs text-left text-base leading-6 text-black">
        {text}
      </p>
    </div>
  );
};

export default UserConnection;
import React from "react";

type AssessmentCardProps = {
  children?: React.ReactNode;
  className?: string;
};

function AssessmentCard({
  children,
  className = "",
}: AssessmentCardProps) {
  return (
    <div
      className={`relative w-fit min-w-[300px] ${className}`}
    >
      {/* Background SVG */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 496 407"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d_54852_33348)">
          <path
            d="M153.695 49.3262C159.009 58.7685 169.003 64.6113 179.838 64.6113H448C464.569 64.6113 478 78.0428 478 94.6113V358.044C478 374.612 464.569 388.044 448 388.044H48C31.4315 388.044 18 374.612 18 358.044V48C18 31.4315 31.4315 18 48 18H118.522C129.358 18 139.351 23.8428 144.666 33.2851L153.695 49.3262Z"
            fill="white"
          />
        </g>

        <defs>
          <filter
            id="filter0_d_54852_33348"
            x="0"
            y="0"
            width="496"
            height="406.043"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />

            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />

            <feMorphology
              radius="3"
              operator="dilate"
              in="SourceAlpha"
              result="effect1_dropShadow_54852_33348"
            />

            <feOffset />

            <feGaussianBlur stdDeviation="7.5" />

            <feComposite
              in2="hardAlpha"
              operator="out"
            />

            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
            />

            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_54852_33348"
            />

            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_54852_33348"
              result="shape"
            />
          </filter>
        </defs>
      </svg>

      {/* Content */}
      <div className="relative z-10 p-6 flex flex-col">
        {children}
      </div>
    </div>
  );
}

export default AssessmentCard;
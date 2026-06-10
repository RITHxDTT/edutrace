import React from "react";

type Props = {
  className?: string;
};

export default function TaskBase({ className = "" }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 402 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* <g filter="url(#filter0_d_56157_40165)"> */}
        <g >
        <path
          d="M283.59 76C283.59 87.0457 292.544 96 303.59 96H364C375.046 96 384 104.954 384 116V442C384 453.046 375.046 462 364 462H38C26.9543 462 18 453.046 18 442V38C18 26.9543 26.9543 18 38 18H263.59C274.636 18 283.59 26.9543 283.59 38V76Z"
          fill="white"
        />
      </g>

      <defs>
        <filter
          id="filter0_d_56157_40165"
          x="0"
          y="0"
          width="402"
          height="580"
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
            // result="effect1_dropShadow_56157_40165"
          />

          <feOffset />

          <feGaussianBlur stdDeviation="7.5" />

          <feComposite in2="hardAlpha" operator="out" />

          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
          />

          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            // result="effect1_dropShadow_56157_40165"
          />

          <feBlend
            mode="normal"
            in="SourceGraphic"
            // in2="effect1_dropShadow_56157_40165"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}

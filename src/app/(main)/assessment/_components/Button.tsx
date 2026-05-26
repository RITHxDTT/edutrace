"use client";

import { ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

const variants: Record<Variant, string> = {
  primary: "bg-indigo-600 hover:bg-indigo-700 text-white border-transparent",
  secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800 border-transparent",
  danger: "bg-red-500 hover:bg-red-600 text-white border-transparent",
  ghost: "bg-transparent hover:bg-gray-100 text-gray-700 border-transparent",
  outline: "bg-white hover:bg-gray-50 text-gray-700 border-gray-200",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-6 py-2.5 text-sm rounded-xl",
  lg: "px-8 py-3 text-base rounded-xl",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  type = "button",
  icon,
  iconPosition = "left",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 font-semibold border
        transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${disabled || loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      {loading ? (
        <>
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          Loading...
        </>
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <span className="w-4 h-4">{icon}</span>
          )}
          {children}
          {icon && iconPosition === "right" && (
            <span className="w-4 h-4">{icon}</span>
          )}
        </>
      )}
    </button>
  );
}

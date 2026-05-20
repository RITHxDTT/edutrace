'use client';

import React from 'react';

interface SubmitButtonProps {
  text: string;
}

export default function SubmitButton({ text }: SubmitButtonProps) {
  return (
    <button 
      type="submit" 
      className="w-full hover:cursor-pointer bg-accent-linear-purple text-white font-medium rounded-xl py-3.5 mt-4 transition-all duration-200 text-sm shadow-md shadow-primary/20 hover:opacity-90"
    >
      {text}
    </button>
  );
}
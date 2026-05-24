'use client';

import React, { useState, useRef, ChangeEvent, KeyboardEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import LeftSideCover from '../../_components/RightSideComponent';
import LogoComponent from '../../_components/Logo';
import { PrimaryButton } from '@/components/Buttons/PrimaryButton';

export default function VerificationForm() {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value;
    if (isNaN(Number(value))) return; 

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const finalOtpCode: string = otp.join('');
    console.log('Submitted Verification Code:', finalOtpCode);
  };

  return (
    <div className="flex min-h-screen w-full bg-bg-white font-sans overflow-hidden">
      
      {/* left */}
      <div className="flex flex-col justify-between w-full lg:w-[45%] p-8 sm:p-12 md:p-16 relative z-10 bg-white">
        {/* Logo */}
       <LogoComponent/>

        {/* main */}
        <div className="w-full max-w-xl mx-auto my-auto py-8 text-center flex flex-col items-center">
          <h1 className="text-3xl font-bold bg-accent-linear-purple bg-clip-text text-transparent mb-2">Enter Verification Code</h1>
          <p className="text-text-color-muted text-sm mb-10">Enter 6 digits code that you received from your email.</p>

          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-8">
            {/* 6 digit */}
            <div className="flex justify-between gap-2 sm:gap-3">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={data}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e.target, index)}
                  onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, index)}
                  className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-bold text-text-color-strong bg-primary/5 border border-primary/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-transparent shadow-sm"
                />
              ))}
            </div>

            {/* Resend code */}
            <p className="text-xs text-text-color-muted">
              Didn't receive OTP code?{' '}
              <button type="button" className="text-primary font-bold hover:underline hover:cursor-pointer">
                Resend code
              </button>
            </p>

            {/* Reusable component btn */}
            <PrimaryButton className={"w-full"} size={"md"}>Verify</PrimaryButton>
          </form>

          
          <p className="text-sm text-text-color-strong/80 mt-6">
            Back to{' '}
            <button type="button" onClick={() => router.push('/login')} className="text-primary hover:cursor-pointer font-semibold underline hover:text-primary/80">
              Sign in
            </button>
          </p>
        </div>
        
        <div className="hidden lg:block h-8"></div>
      </div>

      {/* right side component */}
      <LeftSideCover/>
    </div>
  );
}
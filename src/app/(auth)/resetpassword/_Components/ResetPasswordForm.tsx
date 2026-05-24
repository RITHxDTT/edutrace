'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Eye } from 'lucide-react';
import { ResetPasswordData } from '@/types/auth';
import { useRouter } from 'next/navigation';
import SubmitButton from '../../_components/SubmitButton';
import LogoComponent from '../../_components/Logo';
import LeftSideCover from '../../_components/RightSideComponent';

export default function ResetPasswordForm() {
  const router = useRouter();
  
  const [formData, setFormData] = useState<ResetPasswordData>({
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Reset Password Submitted Data:', formData);
  };

  return (
    <div className="flex min-h-screen w-full bg-bg-white font-sans overflow-hidden">
      
      {/* left side */}
      <div className="flex flex-col justify-between w-full lg:w-[45%] p-8 sm:p-12 md:p-16 relative z-10 bg-white">
        {/* Logo */}
       <LogoComponent/>

        {/* main */}
        <div className="w-full max-w-md mx-auto my-auto py-8">
          <h1 className="text-3xl font-bold bg-accent-linear-purple bg-clip-text text-transparent mb-2">Reset new Password</h1>
          <p className="text-text-color-muted text-sm mb-8">Please input all requirement to change password successfully</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* new password */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-text-color-strong">New Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Password" 
                  className="w-full bg-primary/5 placeholder-text-color-muted/50 text-text-color-strong rounded-xl px-4 py-3.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <Eye className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-color-muted cursor-pointer" />
              </div>
            </div>

            {/* cf passwrd */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-text-color-strong">Confirm Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Password" 
                  className="w-full bg-primary/5 placeholder-text-color-muted/50 text-text-color-strong rounded-xl px-4 py-3.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <Eye className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-color-muted cursor-pointer" />
              </div>
            </div>

            {/* Reusable component btn */}
            <SubmitButton text="Save Change" />
          </form>

          
          <p className="text-center text-sm text-text-color-strong/80 mt-6">
            Back to{' '}
            <button type="button" onClick={() => router.push('/login')} className="text-primary hover:cursor-pointer font-semibold underline hover:text-primary/80">
              Sign in
            </button>
          </p>
        </div>
        
        <div className="hidden lg:block h-8"></div>
      </div>

      {/* right side components */}
      <LeftSideCover/>
    </div>
  );
}
'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Mail } from 'lucide-react';
import { ForgotPasswordData } from '@/types/auth';
import { useRouter } from 'next/navigation';
import LeftSideCover from '../../_components/RightSideComponent';
import LogoComponent from '../../_components/Logo';
import { PrimaryButton } from '@/components/Buttons/PrimaryButton';

export default function ForgotPasswordForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<ForgotPasswordData>({
    email: '',
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

    console.log('Forgot Password Submitted Email:', formData.email);
  };

  return (
 
          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-text-color-strong">Email</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email here..."
                  className="w-full bg-primary/5 placeholder-text-color-muted/50 text-text-color-strong rounded-xl px-4 py-3.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-color-muted" />
              </div>
            </div>

            {/* Reusable component btn */}
            <PrimaryButton className={"w-full rounded-xl"} size={"md"}>Continue</PrimaryButton>
          </form>
  );
}
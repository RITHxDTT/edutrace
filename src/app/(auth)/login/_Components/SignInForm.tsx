'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Mail, EyeOff } from 'lucide-react';
import { LoginFormData } from '../../../../../types/auth';
import { useRouter } from 'next/navigation';
import SubmitButton from '../../_components/SubmitButton'; 
import LogoComponent from '../../_components/Logo';
import LeftSideCover from '../../_components/RightSideComponent';
import { signIn } from 'next-auth/react';


export default function LoginForm() {
  const router = useRouter();
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const result = await signIn("credentials", {
    email: formData.email,
    password: formData.password,
    redirect: false,
  });

  if (result?.ok) {
    router.push("/");
  } else {
    alert("Incorrect email or password");
  }
};

  return (
    <div className="flex min-h-screen w-full bg-bg-white font-sans overflow-hidden">
      
      {/* left */}
      <div className="flex flex-col justify-between w-full lg:w-[45%] p-8 sm:p-12 md:p-16 relative z-10 bg-white">
        {/* logo */}
      <LogoComponent/>

        {/* main */}
        <div className="w-full max-w-md mx-auto my-auto py-8">
          <h1 className="text-3xl font-bold bg-accent-linear-purple bg-clip-text text-transparent mb-2">Login</h1>
          <p className="text-text-color-muted text-sm mb-8">Welcome back! Sign in to continue your learning journey.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            
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

            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-text-color-strong">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password" 
                  className="w-full bg-primary/5 placeholder-text-color-muted/50 text-text-color-strong rounded-xl px-4 py-3.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <EyeOff className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-color-muted cursor-pointer" />
              </div>
              
              <div className="text-right pt-1">
                <button type="button" onClick={()=> router.push('/forgotpassword')} className="hover:cursor-pointer text-xs text-primary font-semibold hover:underline">
                  Forgot Password?
                </button>
              </div>
            </div>

            {/* component  */}
            <SubmitButton text="Sign in" />
          </form>

          
          <p className="text-center text-sm text-text-color-strong/80 mt-6">
            Does not have an account?{' '}
            <button type="button" onClick={()=>router.push('/register')} className="text-primary hover:cursor-pointer font-semibold underline hover:text-primary/80">
              Sign up
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
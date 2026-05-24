'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { User, Mail, EyeOff } from 'lucide-react';
import { FormData } from '@/types/auth';
import { useRouter } from 'next/navigation';
import SubmitButton from '../../_components/SubmitButton';
import LogoComponent from '../../_components/Logo';
import LeftSideCover from '../../_components/RightSideComponent';

export default function SignUpForm() {
  const router = useRouter();
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form Submitted Data:', formData);
    router.push('/view');
  };

  return (
    <div className="flex min-h-screen w-full bg-bg-white font-sans overflow-hidden">
      
      {/* left side form */}
      <div className="flex flex-col justify-between w-full lg:w-[45%] p-8 sm:p-12 md:p-16 relative z-10 bg-white">
        {/* logo component */}
       <LogoComponent/>

        {/* main */}
        <div className="w-full max-w-md mx-auto my-auto py-8">
          <h1 className="text-3xl font-bold bg-accent-linear-purple bg-clip-text text-transparent mb-2">Create New Account</h1>
          <p className="text-text-color-muted text-sm mb-8">Begin your productive learning experience today.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-text-color-strong">First Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter your first name" 
                    className="w-full bg-primary/5 placeholder-text-color-muted/50 text-text-color-strong rounded-xl px-4 py-3.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-color-muted" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-text-color-strong">Last Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter your last name" 
                    className="w-full bg-primary/5 placeholder-text-color-muted/50 text-text-color-strong rounded-xl px-4 py-3.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-color-muted" />
                </div>
              </div>
            </div>

            
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
            </div>

            {/* component btn */}
            <SubmitButton text="Sign up" />
          </form>

          <p className="text-center text-sm text-text-color-strong/80 mt-6">
            Already have an account?{' '}
            <button type="button" onClick={()=> router.push('/login')} className="text-primary hover:cursor-pointer font-semibold underline hover:text-primary/80">
              Sign in
            </button>
          </p>
        </div>
        
        <div className="hidden lg:block h-8"></div>
      </div>

      {/* right  component section */}
      <LeftSideCover/>
     
    </div>
  );
}
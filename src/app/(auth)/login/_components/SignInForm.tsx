'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { Mail, EyeOff } from 'lucide-react';
import { LoginFormData } from '../../../../types/auth';
import { useRouter } from 'next/navigation';
import { PrimaryButton } from '@/components/Buttons/PrimaryButton';
import Link from 'next/link';
import { loginAction } from '@/actions/auth.action';
import PrimaryInput from '@/components/Inputs/PrimaryInputField';
import { Eye, EyeSlash } from 'iconsax-react';
import { PreviewCard } from '@base-ui/react';


export default function LoginForm() {
  const router = useRouter();
  const [isVisible, setVisible] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      email: formData.email,
      password: formData.password
    }
    const result = await loginAction(data);

    console.log(result)
  };

  return (
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
        <div className="relative">
          <PrimaryInput
            label="Password"
            name="password"
            placeholder='Password'
            type={isVisible ? "text" : "password"}
            icon={isVisible ? Eye : EyeSlash}
            iconPosition="right"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>

        <div className="text-right pt-1">
          <Link href={"/forgot-password"} className="hover:cursor-pointer text-xs text-primary font-semibold hover:underline">
            Forgot Password?
          </Link>
        </div>
      </div>
      <PrimaryButton className={"w-full rounded-xl"} size={"md"} type='submit'>Sign In</PrimaryButton>
    </form>


  );
}
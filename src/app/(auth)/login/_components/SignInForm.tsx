'use client';

import { useState } from 'react';
import { PrimaryButton } from '@/components/Buttons/PrimaryButton';
import Link from 'next/link';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import PrimaryInput from '@/components/Inputs/PrimaryInputField';
import { Eye, EyeSlash, SmsEdit } from 'iconsax-react';
import { loginFormSchema } from '@/schemas/LoginFormSchema';
import { loginAction } from '@/actions/auth.action';
import { LoginFormData } from '@/types/auth';
import ServerError from '../../_components/ServerError';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [isVisible, setVisible] = useState(false);
  const [serverError, setServerError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  })

  const onSubmit = async (data: LoginFormData) => {
    setServerError("");

    try {
      const res = await loginAction(data);

      if (res?.error) {
        setServerError(res.error);
        return;
      }
      router.push("/dashboard");
    } catch (error) {
      setServerError("An unexpected error occurred. Please try again.");
      console.error("Client caught error:", error);
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8" noValidate>
      {serverError && <ServerError serverError={serverError} />}
      <div className="space-y-1.5">
        <PrimaryInput
          label="Email"
          placeholder="Enter your email here..."
          type="email"
          icon={SmsEdit}
          iconPosition="right"
          isInvalid={!!errors.email}
          errorMessage={errors.email?.message}
          {...register("email")}
        />
      </div>


      <div className="space-y-1.5">
        <PrimaryInput
          {...register('password')}
          label="Password"
          name="password"
          placeholder='Password'
          type={isVisible ? "text" : "password"}
          icon={isVisible ? Eye : EyeSlash}
          iconPosition="right"
          onIconClick={() => setVisible(prev => !prev)}
          isInvalid={!!errors.password}
          errorMessage={errors.password?.message}
        />

        <div className="text-right pt-1">
          <Link href={"/forgot-password"} className="hover:cursor-pointer text-xs bg-linear-purple bg-clip-text text-transparent hover:underline">
            Forgot Password?
          </Link>
        </div>
      </div>
      <PrimaryButton className={"w-full rounded-[8px]"} size={"md"} type='submit' disabled={isSubmitting}>{isSubmitting ? "Signining In..." : "Sign In"}</PrimaryButton>
    </form>


  );
}
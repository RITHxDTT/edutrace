"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { PrimaryButton } from '@/components/Buttons/PrimaryButton';
import PrimaryInput from '@/components/Inputs/PrimaryInputField';
import PrimarySelect from '@/components/Selects/PrimarySelect';
import { SelectItem } from '@heroui/select';

import {
  Eye,
  EyeSlash,
  SmsEdit,
  UserSquare
} from 'iconsax-react';

import { registerAction } from '@/actions/auth.action';
import { RegisterFormSchema } from '@/schemas/RegisterFormSchema';

import { ClassroomProps } from '@/types/classroom';
import { RegisterFormData } from '@/types/auth';

import ServerError from '../../_components/ServerError';

export default function SignUpForm() {

  const [isVisible, setVisible] = useState(false);
  const [serverError, setServerError] = useState("");

  const router = useRouter();

  const schema = RegisterFormSchema;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      gender: undefined,
    },
    mode: "onTouched",
  });

  const onSubmit = async (data: RegisterFormData) => {

    setServerError('');

    try {

      const res = await registerAction(data);

      if (res?.error) {
        setServerError(res.error);
        return;
      }

      router.push(
        `/verify-email?email=${encodeURIComponent(data.email)}`
      );

    } catch (error) {

      setServerError(
        'An unexpected error occurred. Please try again.'
      );

      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-6">

      {serverError && (
        <ServerError serverError={serverError} />
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >

        <div className="flex flex-col gap-5">

          <div className="grid grid-cols-2 gap-4">

            <PrimaryInput
              label="First Name"
              placeholder="First Name"
              type="text"
              icon={UserSquare}
              iconPosition="right"
              isInvalid={!!errors.firstName}
              errorMessage={errors.firstName?.message}
              {...register('firstName')}
            />

            <PrimaryInput
              label="Last Name"
              placeholder="Last Name"
              type="text"
              icon={UserSquare}
              iconPosition="right"
              isInvalid={!!errors.lastName}
              errorMessage={errors.lastName?.message}
              {...register('lastName')}
            />

          </div>

          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <PrimarySelect
                label="Gender"
                placeholder="Select Gender"
                selectedKeys={field.value ? [field.value] : []}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as "MALE" | "FEMALE";
                  field.onChange(value);
                }}
                isInvalid={!!errors.gender}
                errorMessage={errors.gender?.message}
              >
                <SelectItem key="MALE">Male</SelectItem>
                <SelectItem key="FEMALE">Female</SelectItem>
              </PrimarySelect>
            )}
          />

          <PrimaryInput
            label="Email"
            placeholder="Enter your email here..."
            type="email"
            icon={SmsEdit}
            iconPosition="right"
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
            {...register('email')}
          />

          <PrimaryInput
            label="Password"
            placeholder="Password"
            type={isVisible ? 'text' : 'password'}
            icon={isVisible ? Eye : EyeSlash}
            iconPosition="right"
            onIconClick={() => setVisible((p) => !p)}
            isInvalid={!!errors.password}
            errorMessage={errors.password?.message}
            {...register('password')}
          />


        </div>

        <div className="grid grid-cols-1 gap-4 mt-6 h-[45px]">

          <PrimaryButton
            type="submit"
            variant={"default"}
            iconPosition='none'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing Up...' : 'Sign Up'}
          </PrimaryButton>

        </div>
      </form>

    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { PrimaryButton } from '@/components/Buttons/PrimaryButton';
import PrimaryInput from '@/components/Inputs/PrimaryInputField';
import PrimarySelect from '@/components/Selects/PrimarySelect';
import { Eye, EyeSlash, SmsEdit, UserSquare, ArrowLeft, ArrowRight } from 'iconsax-react';
import { registerAction } from '@/actions/auth.action';
import { createRegisterFormSchema } from '@/schemas/RegisterFormSchema';

import { ClassroomProps } from '@/types/classroom';
import { RegisterFormData } from '@/types/auth';
import { SelectItem } from '@heroui/select';
import PrimaryDateInput from '@/components/DateField/PrimaryDateField';
import ServerError from '../../_components/ServerError';

const STEPS = [
  { id: 1, label: 'Personal' },
  { id: 2, label: 'Account' },
  { id: 3, label: 'Review' },
];

const STEP_FIELDS: Record<number, (keyof RegisterFormData)[]> = {
  1: ['firstName', 'lastName', 'birthdate', 'gender'],
  2: ['classroomId', 'email', 'password'],
};

export default function SignUpForm({ classrooms }: ClassroomProps) {
  const [step, setStep] = useState(1);
  const [isVisible, setVisible] = useState(false);
  const [serverError, setServerError] = useState('');

  const router = useRouter();

  const schema = createRegisterFormSchema(classrooms.map((c) => c.classroomId));

  const {
    register,
    control,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      classroomId: '',
      gender: undefined,
      birthdate: undefined,
    },
    mode: 'onTouched',
  });

  const handleNext = async () => {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => s - 1);

  const onSubmit = async (data: RegisterFormData) => {
    setServerError('');
    const payload = { ...data, birthdate: data.birthdate?.toString() };
    try {
      const res = await registerAction(payload);
      if (res?.error) { setServerError(res.error); return; }
      router.push('/login');
    } catch (error) {
      setServerError('An unexpected error occurred. Please try again.');
      console.error(error);
    }
  };

  const values = getValues();
  const selectedClassroom = classrooms.find((c) => c.classroomId === values.classroomId);

  return (
    <div className="flex flex-col gap-6">

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300
                  ${step === s.id ? 'bg-linear-purple text-white shadow-md' : ''}
                  ${step > s.id ? 'bg-green-500 text-white' : ''}
                  ${step < s.id ? 'bg-gray-100 text-gray-400' : ''}
                `}
              >
                {step > s.id ? '✓' : s.id}
              </div>
              <span className={`text-sm font-medium hidden sm:block transition-colors
                ${step === s.id ? 'text-gray-800' : 'text-gray-400'}`}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-px w-8 transition-all duration-300 ${step > s.id ? 'bg-green-400' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {serverError && <ServerError serverError={serverError} />}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>

        {/* Step 1 — Personal Info */}
        {step === 1 && (
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
            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="birthdate"
                control={control}
                render={({ field }) => (
                  <PrimaryDateInput
                    label="Birth Date"
                    value={field.value}
                    onChange={field.onChange}
                    isInvalid={!!errors.birthdate}
                    errorMessage={errors.birthdate?.message}
                  />
                )}
              />
              <PrimarySelect
                label="Gender"
                placeholder="Select Gender"
                {...register('gender')}
                isInvalid={!!errors.gender}
                errorMessage={errors.gender?.message}
              >
                <SelectItem key="MALE">Male</SelectItem>
                <SelectItem key="FEMALE">Female</SelectItem>
              </PrimarySelect>
            </div>
          </div>
        )}

        {/* Step 2 — Account Setup */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            <PrimarySelect
              label="Classroom"
              placeholder="Select Classroom"
              {...register('classroomId')}
              isInvalid={!!errors.classroomId}
              errorMessage={errors.classroomId?.message}
            >
              {classrooms?.map((cls) => (
                <SelectItem key={cls.classroomId}>{cls.className}</SelectItem>
              ))}
            </PrimarySelect>
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
        )}

        {/* Step 3 — Review */}
        {step === 3 && (
          <div className="flex flex-col gap-3 bg-gray-50 rounded-xl p-5 text-sm text-gray-700">
            <p className="font-semibold text-gray-900 mb-1">Review your details</p>
            {[
              { label: 'First Name', value: values.firstName },
              { label: 'Last Name', value: values.lastName },
              { label: 'Gender', value: values.gender },
              { label: 'Birthdate', value: values.birthdate?.toString() },
              { label: 'Classroom', value: selectedClassroom?.className },
              { label: 'Email', value: values.email },
              { label: 'Password', value: '••••••••' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between border-b border-gray-100 pb-2 last:border-0">
                <span className="text-gray-500">{label}</span>
                <span className="font-medium text-gray-800">{value || '—'}</span>
              </div>
            ))}
          </div>
        )}

        {/* Navigation buttons */}
        <div className={`flex mt-6 gap-3 ${step > 1 ? 'justify-between' : 'justify-end'}`}>
          {step > 1 && (
            <PrimaryButton onClick={handleBack} variant={"secondary"} iconPosition='left' icon={ArrowLeft}>Back</PrimaryButton>
          )}

          {step < 3 && (
            <PrimaryButton onClick={handleNext} variant={"default"} iconPosition='right' icon={ArrowRight}>Next</PrimaryButton>
          )}

          {step === 3 && (
            <PrimaryButton
              className="rounded-[8px]"
              size="md"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing up...' : 'Create Account'}
            </PrimaryButton>
          )}
        </div>

      </form>
    </div>
  );
}
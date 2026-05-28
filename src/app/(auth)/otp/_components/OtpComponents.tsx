
'use client';

import { useState } from 'react';

import {
  useForm,
  SubmitHandler
} from 'react-hook-form';

import {
  useRouter,
  useSearchParams
} from 'next/navigation';

import Link from 'next/link';

import { PrimaryButton } from '@/components/Buttons/PrimaryButton';

import ServerError from '../../_components/ServerError';

import {
  OtpFormData
} from '@/types/auth';

import {
  verifyEmailAction,
  resendEmailAction
} from '@/actions/auth.action';

interface OtpFields {
  otp1: string;
  otp2: string;
  otp3: string;
  otp4: string;
  otp5: string;
  otp6: string;
}

export default function OTPForm() {

  const [serverError, setServerError] = useState("");

  const router = useRouter();

  const searchParams = useSearchParams();

  const email = searchParams.get('email') || '';

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<OtpFields>({
    defaultValues: {
      otp1: '',
      otp2: '',
      otp3: '',
      otp4: '',
      otp5: '',
      otp6: ''
    }
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    nextField: keyof OtpFields | ""
  ) => {

    const val = e.target.value;

    if (val.length === 1 && nextField) {

      const nextInput =
      document.getElementsByName(nextField)[0] as HTMLInputElement;

      nextInput?.focus();
    }
  };

  const onSubmit: SubmitHandler<OtpFields> = async (data) => {

    setServerError("");

    const fullCode = Object.values(data).join("");

    const payload: OtpFormData = {
      email,
      code: fullCode
    };

    try {

      const res = await verifyEmailAction(
        payload,
        "REGISTRATION"
      );

      if (res.error) {
        setServerError(res.error);
        return;
      }

      router.push("/sign-in");

    } catch (error) {

      setServerError(
        "Invalid verification code. Please try again."
      );
    }
  };

  const fieldNames: (keyof OtpFields)[] = [
    'otp1',
    'otp2',
    'otp3',
    'otp4',
    'otp5',
    'otp6'
  ];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-8"
      noValidate
    >

      {serverError && (
        <ServerError serverError={serverError} />
      )}

      <div className="flex justify-between gap-2">

        {fieldNames.map((name, index) => (

          <input
            key={name}
            {...register(name)}
            type="text"
            maxLength={1}
            onChange={(e) => {

              register(name).onChange(e);

              const nextField =
                index < fieldNames.length - 1
                  ? fieldNames[index + 1]
                  : "";

              handleInputChange(e, nextField);
            }}
            className="w-12 h-12 text-center text-lg font-semibold border border-gray-200 rounded-[8px] focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all"
          />

        ))}

      </div>

      <div className="text-center text-xs text-gray-500">

        Didn't receive OTP code?{' '}

        <button
          type="button"
          className="text-purple-600 font-semibold hover:underline"
          onClick={async () => {

            const res = await resendEmailAction(
              email,
              "REGISTRATION"
            );

            if (res.error) {
              setServerError(res.error);
            }
          }}
        >
          Resend code
        </button>

      </div>

      <PrimaryButton
        className="w-full rounded-[8px]"
        size="md"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Verifying..." : "Verify"}
      </PrimaryButton>

      <div className="text-center">

        <Link
          href="/sign-in"
          className="text-xs text-gray-500 hover:underline"
        >
          Back to Sign in
        </Link>

      </div>

    </form>
  );
}


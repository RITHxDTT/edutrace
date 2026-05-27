'use client';

import { useEffect, useState } from 'react';
import { PrimaryButton } from '@/components/Buttons/PrimaryButton';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { verifyEmailFormSchema } from '@/schemas/VerifyEmailFormSchema';
import { InputOtp } from '@heroui/input-otp';
import { verifyEmailAction } from '@/actions/auth.action';
import { useRouter } from 'next/navigation';
import ServerError from '../../_components/ServerError';
import PrimaryInput from '@/components/Inputs/PrimaryInputField';
import { SmsEdit } from 'iconsax-react';
import { resendOtpCodeService } from '@/services/auth.service';
import { sileo } from 'sileo';
import { OtpFormData } from '@/types/auth';

const STEP_FIELDS: Record<number, (keyof OtpFormData)[]> = {
  1: ['email'],
  2: ['code'],
};

type ResendStatus = 'idle' | 'loading' | 'success' | 'error';

export default function VerifyEmailForm() {
  const [step, setStep] = useState(1);
  const [serverError, setServerError] = useState('');
  const [resendStatus, setResendStatus] = useState<ResendStatus>('idle');
  const [resendMessage, setResendMessage] = useState('');
  const [cooldown, setCooldown] = useState(0);

  const router = useRouter();


  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);


  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    control,
    formState: { errors, isSubmitting },
  } = useForm<OtpFormData>({
    resolver: zodResolver(verifyEmailFormSchema),
    defaultValues: {
      email: '',
      code: '',
    },
  });

  const handleNext = async () => {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => s - 1);

  const handleResend = async () => {
    if (cooldown > 0) return;

    const email = getValues('email');

    setResendStatus('loading');
    setResendMessage('');

    try {
      const res = await resendOtpCodeService(email, 'REGISTRATION');

      setResendStatus('success');
      setResendMessage(res.message ?? 'A new code was sent to your email.');

      setCooldown(60);

    } catch (error) {
      setResendStatus('error');

      setResendMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'
      );
    }
  };

  async function onSubmit(data: OtpFormData) {
    try {
      const res = await verifyEmailAction(data, 'REGISTRATION');

      if (res?.success) {
        setServerError('');
        sileo.success({ title: "Account Verified", description: res.message });
        router.push('/login');
        return;
      }

      if (res?.error) {
        setServerError(res.error);
      }
    } catch (error) {
      setServerError('An unexpected error occurred. Please try again.');
      console.error('Client caught error:', error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-8">
      {serverError && <ServerError serverError={serverError} />}

      {step === 1 && (
        <PrimaryInput
          label="Email"
          placeholder="Enter your email here..."
          className="text-left"
          type="email"
          icon={SmsEdit}
          iconPosition="right"
          isInvalid={!!errors.email}
          errorMessage={errors.email?.message}
          {...register('email')}
        />
      )}

      {step === 2 && (
        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col items-center gap-2">
              <InputOtp
                length={6}
                value={field.value}
                onValueChange={field.onChange}
                classNames={{
                  segmentWrapper: "gap-x-4 justify-center",
                  segment:
                    "w-14 h-14 text-2xl font-semibold rounded-xl border border-gray-300 bg-white text-center shadow-sm transition-all " +
                    "focus:border-purple-500 focus:ring-2 focus:ring-purple-200",
                }}
                size="lg"
                errorMessage={errors.code?.message}
                {...register('code')}
              />
            </div>
          )}
        />
      )}

      {/* Resend code — only relevant on step 2 */}
      {step === 2 && (
        <div className="space-y-1 text-center">
          <p className="text-xs text-muted">
            Didn't receive OTP code?{' '}
            <button
              type="button"
              disabled={resendStatus === 'loading' || cooldown > 0}
              onClick={handleResend}
              className="text-linear-main font-bold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendStatus === 'loading'
                ? 'Sending...'
                : cooldown > 0
                  ? `Resend in ${cooldown}s`
                  : 'Resend code'}
            </button>
          </p>
          {resendMessage && (
            <p
              className={`text-xs ${resendStatus === 'success' ? 'text-success' : 'text-danger'
                }`}
            >
              {resendMessage}
            </p>
          )}
        </div>
      )}

      <div className="flex gap-3">
        {step === 2 && (
          <PrimaryButton
            type="button"
            className="w-full"
            size="md"
            variant="secondary"
            onClick={handleBack}
          >
            Back
          </PrimaryButton>
        )}

        {step === 1 ? (
          <PrimaryButton
            type="button"
            className="w-full"
            size="md"
            onClick={handleNext}
          >
            Next
          </PrimaryButton>
        ) : (
          <PrimaryButton
            type="submit"
            className="w-full"
            size="md"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Verifying...' : 'Verify'}
          </PrimaryButton>
        )}
      </div>
    </form>
  );
}
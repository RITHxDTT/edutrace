'use client';

import { useEffect, useState } from 'react';
import { PrimaryButton } from '@/components/Buttons/PrimaryButton';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ForgotPasswordFormData } from '@/types/auth';
import { InputOtp } from '@heroui/input-otp';
import { forgotPasswordAction, resetPasswordAction, verifyEmailAction } from '@/actions/auth.action';
import { useRouter } from 'next/navigation';
import ServerError from '../../_components/ServerError';
import PrimaryInput from '@/components/Inputs/PrimaryInputField';
import { SmsEdit, Eye, EyeSlash } from 'iconsax-react';
import { forgotPasswordFormSchema } from '@/schemas/ForgotPasswordFormSchema';
import { sileo } from 'sileo';

const STEP_FIELDS: Record<number, (keyof ForgotPasswordFormData)[]> = {
  1: ['email'],
  2: ['code'],
  3: ['newPassword', 'confirmNewPassword'],
};

type ResendStatus = 'idle' | 'loading' | 'success' | 'error';

export default function ForgotPasswordForm() {
  const [step, setStep] = useState(1);
  const [verifyToken, setVerifyToken] = useState<string | null>(null);
  const [serverError, setServerError] = useState('');
  const [resendStatus, setResendStatus] = useState<ResendStatus>('idle');
  const [resendMessage, setResendMessage] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVisible, setVisible] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: '',
      code: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

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

  const handleNext = async () => {
    const valid = await trigger(STEP_FIELDS[step]);
    if (!valid) return;

    setServerError('');

    if (step === 1) {
      const email = getValues('email');
      setIsSendingCode(true);

      const res = await forgotPasswordAction(email);
      setIsSendingCode(false);

      if (res?.error) {
        setServerError(res.error);
        return;
      }

      setStep((s) => s + 1);
      return;
    }

    if (step === 2) {
      const payload = getValues();
      setIsSendingCode(true);

      const res = await verifyEmailAction(
        { email: payload.email, code: payload.code },
        'FORGOT_PASSWORD'
      );

      setIsSendingCode(false);

      if (res?.error) {
        setServerError(res.error);
        return;
      }

      setVerifyToken(res.payload.token);
      setStep((s) => s + 1);
      return;
    }

    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setServerError('');
    setStep((s) => s - 1);
  };

  const handleResend = async () => {
    const email = getValues('email');
    setResendStatus('loading');
    setResendMessage('');
    setCooldown(60);

    try {
      const res = await forgotPasswordAction(email);
      setResendStatus('success');
      setResendMessage(res?.message ?? 'A new code was sent to your email.');
    } catch (error) {
      setResendStatus('error');
      setResendMessage(
        error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      );
    }
  };

  async function onSubmit(data: ForgotPasswordFormData) {
    if (!verifyToken) {
      setServerError('Verification token is missing. Please restart the process.');
      return;
    }

    try {
      setServerError('');

      const res = await resetPasswordAction(data, verifyToken);

      if (res?.success) {
        sileo.success({
          title: 'Password Reset',
          description: 'Your password has been reset successfully. Please log in with your new password.',
        });
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

      {/* Step 1: Email Input */}
      <div className={step === 1 ? 'block' : 'hidden'}>
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
      </div>

      {/* Step 2: OTP Input */}
      <div className={step === 2 ? 'block' : 'hidden'}>
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
                isInvalid={!!errors.code}
                errorMessage={errors.code?.message}
              />
            </div>
          )}
        />
      </div>

      {/* Step 3: Password Reset Fields */}
      <div className={step === 3 ? 'flex flex-col gap-8' : 'hidden'}>
        <PrimaryInput
          {...register('newPassword')}
          label="New Password"
          placeholder="Enter your new password..."
          type={isVisible ? 'text' : 'password'}
          icon={isVisible ? Eye : EyeSlash}
          iconPosition="right"
          onIconClick={() => setVisible((prev) => !prev)}
          isInvalid={!!errors.newPassword}
          errorMessage={errors.newPassword?.message}
        />
        <PrimaryInput
          {...register('confirmNewPassword')}
          label="Confirm Password"
          placeholder="Confirm new password..."
          type={isVisible ? 'text' : 'password'}
          icon={isVisible ? Eye : EyeSlash}
          iconPosition="right"
          onIconClick={() => setVisible((prev) => !prev)}
          isInvalid={!!errors.confirmNewPassword}
          errorMessage={errors.confirmNewPassword?.message}
        />
      </div>

      {/* Resend Cooldown UI (Step 2 Only) */}
      {step === 2 && (
        <div className="space-y-1 text-center">
          <p className="text-xs text-muted">
            Didn't receive OTP code?{' '}
            <button
              type="button"
              disabled={resendStatus === 'loading' || cooldown > 0}
              onClick={handleResend}
              className="text-linear-main cursor-pointer hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendStatus === 'loading'
                ? 'Sending...'
                : cooldown > 0
                  ? `Resend in ${cooldown}s`
                  : 'Resend code'}
            </button>
          </p>
          {resendMessage && (
            <p className={`text-xs ${resendStatus === 'success' ? 'text-success' : 'text-danger'}`}>
              {resendMessage}
            </p>
          )}
        </div>
      )}

      {/* Navigation Controls */}
      <div className="flex gap-3">
        {step > 1 && (
          <PrimaryButton
            type="button"
            className="w-full"
            size="md"
            variant="secondary"
            onClick={handleBack}
            disabled={isSubmitting || isSendingCode}
          >
            Back
          </PrimaryButton>
        )}

        {step < 3 ? (
          <PrimaryButton
            type="button"
            className="w-full"
            size="md"
            disabled={isSendingCode}
            onClick={handleNext}
          >
            {isSendingCode ? 'Verifying...' : 'Next'}
          </PrimaryButton>
        ) : (
          <PrimaryButton
            type="submit"
            className="w-full"
            size="md"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </PrimaryButton>
        )}
      </div>
    </form>
  );
}
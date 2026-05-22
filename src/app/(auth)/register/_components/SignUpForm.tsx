'use client';

import { useActionState, useState } from 'react';
import { PrimaryButton } from '@/components/Buttons/PrimaryButton';
import { Eye, EyeSlash, SmsEdit, UserSquare } from 'iconsax-react';
import PrimaryInput from '@/components/Inputs/PrimaryInputField';
import { registerAction } from '@/actions/auth.action';

export default function SignUpForm() {
  const [isVisible, setVisible] = useState(false);

  const [state, action, isPending] = useActionState(registerAction, {
    success: false,
    errors: {},
  });
  console.log(state.errors)
  return (
    <form action={action} className="flex flex-col gap-8" noValidate>

      <div className="grid grid-cols-2 gap-4">
        <PrimaryInput
          label="First Name"
          name="firstName"
          placeholder="First Name"
          type="text"
          icon={UserSquare}
          iconPosition="right"
          isInvalid={!!state.errors?.firstName?.[0]}
          errorMessage={state.errors?.firstName?.[0]}
        />
        <PrimaryInput
          label="Last Name"
          name="lastName"
          placeholder="Last Name"
          type="text"
          icon={UserSquare}
          iconPosition="right"
          isInvalid={!!state.errors?.lastName?.[0]}
          errorMessage={state.errors?.lastName?.[0]}
        />
      </div>

      <PrimaryInput
        label="Email"
        name="email"
        placeholder="Enter your email here..."
        type="email"
        icon={SmsEdit}
        isInvalid={!!state.errors?.email?.[0]}
        errorMessage={state.errors?.email?.[0]}

      />

      <PrimaryInput
        label="Password"
        name="password"
        placeholder="Password"
        type={isVisible ? "text" : "password"}
        icon={isVisible ? Eye : EyeSlash}
        onIconClick={() => setVisible(v => !v)}
        isInvalid={!!state.errors?.password?.[0]}
        errorMessage={state.errors?.password?.[0]}

      />

      <PrimaryButton
        className="w-full rounded-[8px]"
        size="md"
        type="submit"
        disabled={isPending}
      >
        {isPending ? 'Signing up...' : 'Sign Up'}
      </PrimaryButton>
    </form>
  );
}
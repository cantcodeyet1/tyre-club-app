import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { forgotPassword } from '../api';
import {
  AuthBackButton,
  AuthInput,
  AuthPrimaryButton,
  AuthScreen,
} from '../components/AuthScreenChrome';
import { emailSchema, type EmailFormValues } from '../schemas';

export default function ForgotPassword() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  async function onSubmit(values: EmailFormValues) {
    await forgotPassword(values.email);
    setSentTo(values.email);
  }

  return (
    <AuthScreen>
      <section className="relative flex min-h-screen flex-col px-[42px] pb-10 pt-[15px]">
        <AuthBackButton className="-ml-[42px]" />

        <div className="flex flex-1 flex-col items-center justify-center pb-[110px] text-center">
          <div className="grid size-[76px] place-items-center rounded-[12px] border border-primary bg-primary-light text-[52px] font-black leading-none text-primary">
            ?
          </div>

          <h1 className="mt-9 text-[22px] font-black leading-tight">
            {sentTo ? 'Check your email' : 'Forgot password?'}
          </h1>
          <p className="mt-4 max-w-[260px] text-[13px] font-medium leading-[1.15] text-textPrimary">
            {sentTo
              ? `A reset link was sent to ${sentTo}.`
              : "Enter your email and we'll send you a link to reset your password."}
          </p>

          {sentTo ? (
            <Link
              className="mt-[96px] inline-flex h-[38px] w-full max-w-[290px] items-center justify-center rounded-[8px] bg-yellow-cta text-[13px] font-black text-textPrimary shadow-yellow"
              to="/reset-password"
            >
              Enter reset token
            </Link>
          ) : (
            <form
              className="mt-[78px] w-full max-w-[290px]"
              onSubmit={handleSubmit(onSubmit)}
            >
              <AuthInput
                autoComplete="email"
                invalid={Boolean(errors.email)}
                placeholder="ex: jon.smith@email.com"
                type="email"
                {...register('email')}
              />
              {errors.email?.message ? (
                <p className="mt-3 text-left text-[12px] font-bold text-danger-text">
                  {errors.email.message}
                </p>
              ) : null}
              <AuthPrimaryButton
                className="mt-6"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? 'Sending...' : 'Send email'}
              </AuthPrimaryButton>
            </form>
          )}
        </div>
      </section>
    </AuthScreen>
  );
}

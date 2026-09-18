import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { useGoogleAuth } from '../../../shared/hooks/useGoogleAuth';
import { useAuth } from '../authStore';
import {
  AuthInput,
  AuthPrimaryButton,
  AuthScreen,
  DunlopExpressLogo,
  FieldLabel,
  SocialButtons,
  TyreClubLogo,
} from '../components/AuthScreenChrome';
import { signUpSchema, type SignUpFormValues } from '../schemas';

export default function SignUp() {
  const { register: registerUser, loginWithGoogle } = useAuth();
  const { requestGoogleAccessToken } = useGoogleAuth();
  const navigate = useNavigate();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', name: '', password: '' },
  });

  async function onSubmit(values: SignUpFormValues) {
    setFormError(null);
    try {
      await registerUser(values);
      navigate('/notifications/permission', { replace: true });
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : 'Unable to create account',
      );
    }
  }

  async function onGoogleClick() {
    setFormError(null);
    setIsGoogleLoading(true);
    try {
      const accessToken = await requestGoogleAccessToken();
      await loginWithGoogle({ accessToken });
      navigate('/notifications/permission', { replace: true });
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : 'Unable to sign up with Google',
      );
    } finally {
      setIsGoogleLoading(false);
    }
  }

  return (
    <AuthScreen>
      <section className="px-[42px] pb-10 pt-[29px]">
        <div className="flex items-center justify-between">
          <DunlopExpressLogo className="text-[16px]" />
          <TyreClubLogo className="size-[42px]" />
        </div>

        <h1 className="mt-12 text-[22px] font-black leading-tight">
          Create your account
        </h1>

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <label>
            <FieldLabel>Name</FieldLabel>
            <AuthInput
              autoComplete="name"
              invalid={Boolean(errors.name)}
              placeholder="ex: jon smith"
              {...register('name')}
            />
          </label>

          <label>
            <FieldLabel>Email</FieldLabel>
            <AuthInput
              autoComplete="email"
              invalid={Boolean(errors.email)}
              placeholder="ex: jon.smith@email.com"
              type="email"
              {...register('email')}
            />
          </label>

          <label>
            <FieldLabel>Password</FieldLabel>
            <AuthInput
              autoComplete="new-password"
              invalid={Boolean(errors.password)}
              placeholder="********"
              type="password"
              {...register('password')}
            />
          </label>

          <label>
            <FieldLabel>Confirm password</FieldLabel>
            <AuthInput
              autoComplete="new-password"
              placeholder="********"
              type="password"
            />
          </label>

          <label className="flex items-center gap-2 text-[11px] font-semibold text-textSecondary">
            <input
              checked={acceptedTerms}
              className="size-[12px] appearance-none rounded-[2px] border border-primary checked:bg-yellow-cta"
              type="checkbox"
              onChange={(event) => setAcceptedTerms(event.target.checked)}
            />
            I understood the{' '}
            <span className="text-primary">terms &amp; policy.</span>
          </label>

          {formError ||
          errors.name?.message ||
          errors.email?.message ||
          errors.password?.message ? (
            <p className="text-[12px] font-bold text-danger-text">
              {formError ??
                errors.name?.message ??
                errors.email?.message ??
                errors.password?.message}
            </p>
          ) : null}

          <AuthPrimaryButton
            className="uppercase"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'CREATING...' : 'SIGN UP'}
          </AuthPrimaryButton>
        </form>

        <p className="mt-6 text-center text-[13px] font-medium text-textTertiary">
          or sign up with
        </p>
        <div className="mt-5">
          <SocialButtons
            isGoogleLoading={isGoogleLoading}
            onGoogleClick={onGoogleClick}
          />
        </div>

        <p className="mt-8 text-center text-[13px] font-medium text-textTertiary">
          Have an account?{' '}
          <Link className="font-bold text-primary" to="/sign-in">
            SIGN IN
          </Link>
        </p>
      </section>
    </AuthScreen>
  );
}

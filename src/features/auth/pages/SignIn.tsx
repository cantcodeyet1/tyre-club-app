import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useGoogleAuth } from '../../../shared/hooks/useGoogleAuth';
import { useSettingsStore } from '../../../shared/stores/settingsStore';
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
import { signInSchema, type SignInFormValues } from '../schemas';

type LocationState = {
  from?: { pathname?: string };
};

export default function SignIn() {
  const { login, loginWithGoogle } = useAuth();
  const { requestGoogleAccessToken } = useGoogleAuth();
  const landingScreen = useSettingsStore((state) => state.landingScreen);
  const location = useLocation();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  function goToDestination() {
    const state = location.state as LocationState | null;
    navigate(state?.from?.pathname ?? `/${landingScreen}`, { replace: true });
  }

  async function onSubmit(values: SignInFormValues) {
    setFormError(null);
    try {
      await login(values);
      goToDestination();
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : 'Unable to sign in',
      );
    }
  }

  async function onGoogleClick() {
    setFormError(null);
    setIsGoogleLoading(true);
    try {
      const accessToken = await requestGoogleAccessToken();
      await loginWithGoogle({ accessToken });
      goToDestination();
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : 'Unable to sign in with Google',
      );
    } finally {
      setIsGoogleLoading(false);
    }
  }

  return (
    <AuthScreen>
      <section className="flex min-h-screen flex-col px-[42px] pb-12 pt-[35px]">
        <div className="flex flex-col items-center">
          <DunlopExpressLogo />
          <TyreClubLogo className="mt-8 size-[82px]" />
        </div>

        <h1 className="mt-[82px] text-[22px] font-black leading-tight">
          Sign in your account
        </h1>

        <form className="mt-[68px]" onSubmit={handleSubmit(onSubmit)}>
          <AuthInput
            autoComplete="email"
            invalid={Boolean(errors.email)}
            placeholder="ex: jon.smith@email.com"
            type="email"
            {...register('email')}
          />

          <label className="mt-4 block">
            <FieldLabel>Password</FieldLabel>
            <AuthInput
              autoComplete="current-password"
              invalid={Boolean(errors.password)}
              placeholder="********"
              type="password"
              {...register('password')}
            />
          </label>

          {formError || errors.email?.message || errors.password?.message ? (
            <p className="mt-3 text-[12px] font-bold text-danger-text">
              {formError ?? errors.email?.message ?? errors.password?.message}
            </p>
          ) : null}

          <AuthPrimaryButton
            className="mt-7 uppercase"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'SIGNING IN...' : 'SIGN IN'}
          </AuthPrimaryButton>
        </form>

        <p className="mt-6 text-center text-[13px] font-medium text-textTertiary">
          or sign in with
        </p>
        <div className="mt-5">
          <SocialButtons
            isGoogleLoading={isGoogleLoading}
            onGoogleClick={onGoogleClick}
          />
        </div>

        <p className="mt-8 text-center text-[13px] font-medium text-textTertiary">
          Don&apos;t have an account?{' '}
          <Link className="font-bold text-primary" to="/sign-up">
            SIGN UP
          </Link>
        </p>

        <Link
          className="mt-4 text-center text-[12px] font-semibold text-textTertiary"
          to="/forgot-password"
        >
          Forgot password?
        </Link>
      </section>
    </AuthScreen>
  );
}

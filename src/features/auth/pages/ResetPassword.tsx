import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { FormField } from '../../../shared/components/domain/FormField';
import { Button } from '../../../shared/components/primitives/Button';
import { Input } from '../../../shared/components/primitives/Input';
import { resetPassword } from '../api';
import { AuthLayout } from '../components/AuthLayout';
import { resetPasswordSchema, type ResetPasswordFormValues } from '../schemas';

export default function ResetPassword() {
  const navigate = useNavigate();
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', token: 'mock-reset-token' },
  });

  async function onSubmit(values: ResetPasswordFormValues) {
    await resetPassword(values);
    navigate('/sign-in');
  }

  return (
    <AuthLayout
      description="Set a fresh password for your Tyre Club account."
      title="Reset password"
    >
      <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField error={errors.token?.message} label="Reset token">
          <Input invalid={Boolean(errors.token)} {...register('token')} />
        </FormField>
        <FormField error={errors.password?.message} label="New password">
          <Input
            invalid={Boolean(errors.password)}
            type="password"
            {...register('password')}
          />
        </FormField>
        <Button disabled={isSubmitting} fullWidth type="submit">
          Save new password
        </Button>
      </form>
    </AuthLayout>
  );
}

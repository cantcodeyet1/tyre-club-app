import { MailCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '../../../shared/components/primitives/Button';
import { Card } from '../../../shared/components/primitives/Card';
import { AuthLayout } from '../components/AuthLayout';

export default function VerifyEmail() {
  return (
    <AuthLayout
      description="Your account is almost ready."
      title="Verify email"
    >
      <Card className="text-center">
        <MailCheck aria-hidden className="mx-auto text-success" size={36} />
        <p className="mt-4 font-bold text-textPrimary">Check your inbox</p>
        <p className="mt-2 text-sm text-textSecondary">
          Open the verification email, then return to sign in and finish setup.
        </p>
        <Button className="mt-5" fullWidth>
          <Link to="/sign-in">Back to sign in</Link>
        </Button>
      </Card>
    </AuthLayout>
  );
}

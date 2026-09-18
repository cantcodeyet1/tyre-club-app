import { env } from '../env.js';

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailInput) {
  if (!env.resendApiKey) {
    console.warn(
      `[mailer] RESEND_API_KEY not set — logging email instead of sending.\nTo: ${to}\nSubject: ${subject}\n${html}`,
    );

    return;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.mailFrom,
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const body = await response.text();

    console.error(`[mailer] Failed to send email via Resend: ${body}`);
  }
}

export function passwordResetEmail(token: string) {
  const resetUrl = `${env.appPublicUrl}/reset-password?token=${token}`;

  return {
    subject: 'Reset your Tyre Club password',
    html: `<p>We received a request to reset your Tyre Club password.</p><p><a href="${resetUrl}">Click here to reset your password</a>. This link expires in 1 hour.</p><p>If you didn't request this, you can ignore this email.</p>`,
  };
}

export function verifyEmailEmail(token: string) {
  const verifyUrl = `${env.appPublicUrl}/verify-email?token=${token}`;

  return {
    subject: 'Verify your Tyre Club email',
    html: `<p>Welcome to Tyre Club!</p><p><a href="${verifyUrl}">Click here to verify your email address</a>.</p>`,
  };
}

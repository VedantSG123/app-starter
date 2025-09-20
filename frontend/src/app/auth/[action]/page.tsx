import { ForgotPassword } from '@/components/custom/auth/ForgotPassword'
import { LoginForm } from '@/components/custom/auth/LoginForm'
import { ResendVerificationForm } from '@/components/custom/auth/ResendVerificationEmail'
import { ResetPassword } from '@/components/custom/auth/ResetPassword'
import { SignupForm } from '@/components/custom/auth/SignupForm'
import { VerifyEmailCallbackPage } from '@/components/custom/auth/VerifyEmailCallback'
import type { AuthPageRouteType } from '@/types/common'

export default async function AuthPage({
  params,
  searchParams,
}: {
  params: Promise<{
    action: AuthPageRouteType
  }>
  searchParams: Promise<{ error?: string }>
}) {
  const { action } = await params

  switch (action) {
    case 'login':
      return <LoginForm />
    case 'register':
      return <SignupForm />
    case 'forgot-password':
      return <ForgotPassword />
    case 'verify-email-callback':
      return <VerifyEmailCallbackPage searchParams={searchParams} />
    case 'resend-verification-email':
      return <ResendVerificationForm />
    case 'reset-password':
      return <ResetPassword />
    default:
      return <div>Unknown action</div>
  }
}

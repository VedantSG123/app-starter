import { LoginForm } from '@/components/custom/auth/LoginForm'
import { SignupForm } from '@/components/custom/auth/SignupForm'

export default async function AuthPage({
  params,
}: {
  params: Promise<{ action: 'login' | 'register' | 'forgot-password' }>
}) {
  const { action } = await params

  switch (action) {
    case 'login':
      return <LoginForm />
    case 'register':
      return <SignupForm />
    case 'forgot-password':
      return <div>Forgot Password Form</div>
    default:
      return <div>Unknown action</div>
  }
}

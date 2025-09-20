// app/auth/verify-email-callback/page.tsx
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

export async function VerifyEmailCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  if (error) {
    return (
      <div className='flex flex-col gap-6'>
        <div className='flex justify-center'>
          <AlertCircle className='h-12 w-12 text-destructive' />
        </div>
        <div className='text-2xl font-semibold text-center'>
          Email Verification Failed
        </div>
        <div className='text-muted-foreground text-center'>
          {friendlyErrorMessage(error)}
        </div>
        <div className='grid gap-4'>
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>Verification Error: {error}</AlertDescription>
          </Alert>
          <div className='flex flex-col gap-2'>
            <Button asChild className='w-full'>
              <Link href='/auth/resend-verification-email'>
                Resend Verification Email
              </Link>
            </Button>
            <Button variant='outline' asChild className='w-full'>
              <Link href='/auth/login'>Go to Login</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // No error → assume verification succeeded
  redirect('/dashboard')
}

function friendlyErrorMessage(error: string): string {
  switch (error) {
    case 'invalid_token':
      return 'The verification link is invalid or has expired.'
    case 'already_verified':
      return 'Your email has already been verified.'
    default:
      return `Verification failed (${error}).`
  }
}

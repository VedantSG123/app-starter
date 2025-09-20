'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Loader2Icon } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth-client'

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export function ResetPassword() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const token = searchParams.get('token')
  const error = searchParams.get('error')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { error } = await authClient.resetPassword({
        newPassword: values.password,
        token: token!,
      })

      if (error) {
        toast.error(
          error.message || 'Failed to reset password. Please try again.'
        )
        return
      }

      toast.success('Password has been reset successfully!')

      // Redirect to login page after successful reset
      router.push('/auth/login')
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to reset password. Please try again.')
      }
    }
  }

  if (!token || error) {
    return <ErrorScreen error={error || 'no_token'} />
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-6'
      >
        <div className='flex flex-col items-center gap-2 text-center'>
          <h1 className='text-2xl font-bold'>Reset your password</h1>
          <p className='text-muted-foreground text-sm text-balance'>
            Enter your new password below
          </p>
        </div>

        <div className='grid gap-6'>
          {/* Password */}
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem className='grid gap-3'>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type='password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem className='grid gap-3'>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type='password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type='submit'
            className='w-full'
            disabled={form.formState.isSubmitting || !form.formState.isValid}
          >
            {form.formState.isSubmitting && (
              <Loader2Icon className='animate-spin' />
            )}
            Reset Password
          </Button>
        </div>

        <div className='text-center text-sm'>
          Remember your password?{' '}
          <Link href='/auth/login' className='underline underline-offset-4'>
            Sign in
          </Link>
        </div>
      </form>
    </Form>
  )
}

function ErrorScreen({ error }: { error: string }) {
  return (
    <div className='flex flex-col gap-6'>
      <div className='flex justify-center'>
        <AlertCircle className='h-12 w-12 text-destructive' />
      </div>
      <div className='text-2xl font-semibold text-center'>
        Password Reset Failed
      </div>
      <div className='text-muted-foreground text-center'>
        {friendlyErrorMessage(error)}
      </div>
      <div className='grid gap-4'>
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>Error: {error}</AlertDescription>
        </Alert>
        <Button variant='outline' asChild className='w-full'>
          <Link href='/auth/login'>Go back to Login</Link>
        </Button>
      </div>
    </div>
  )
}

function friendlyErrorMessage(error: string): string {
  switch (error) {
    case 'invalid_token':
      return 'The link is invalid or has expired.'
    case 'no_token':
      return 'The link is invalid'
    default:
      return `Error (${error}).`
  }
}

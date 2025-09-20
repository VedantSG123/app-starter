'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2Icon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

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
import { cn } from '@/lib/utils'

const formSchema = z.object({
  email: z.email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
})

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  })

  const [ssoLoginLoading, setSsoLoginLoading] = React.useState(false)

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await authClient.signIn.email({
        email: values.email,
        password: values.password,
      })
      router.push(searchParams.get('redirect') || '/dashboard')
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to sign in. Please try again')
      }
    }
  }

  async function ssoLogin() {
    setSsoLoginLoading(true)
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL:
          `${window.location.origin}` +
          (searchParams.get('redirect') || '/dashboard'),
      })
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to sign in. Please try again')
      }
    } finally {
      setSsoLoginLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('flex flex-col gap-6', className)}
        {...props}
      >
        <div className='flex flex-col items-center gap-2 text-center'>
          <h1 className='text-2xl font-bold'>Login to your account</h1>
          <p className='text-muted-foreground text-sm text-balance'>
            Enter your email below to login to your account
          </p>
        </div>

        <div className='grid gap-6'>
          {/* Email */}
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className='grid gap-3'>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type='email' placeholder='m@example.com' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem className='grid gap-3'>
                <div className='flex items-center'>
                  <FormLabel>Password</FormLabel>
                  <Link
                    href='/auth/forgot-password'
                    className='ml-auto text-sm underline-offset-4 hover:underline'
                  >
                    Forgot your password?
                  </Link>
                </div>
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
            Login
          </Button>

          <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
            <span className='bg-background text-muted-foreground relative z-10 px-2'>
              Or continue with
            </span>
          </div>

          <Button
            variant='outline'
            className='w-full cursor-pointer'
            onClick={ssoLogin}
            disabled={ssoLoginLoading || form.formState.isSubmitting}
          >
            <Image width={18} height={18} src='/google.svg' alt='google logo' />
            Sign in with Google
          </Button>
        </div>

        <div className='text-center text-sm'>
          Don&apos;t have an account?{' '}
          <Link href='/auth/register' className='underline underline-offset-4'>
            Sign up
          </Link>
        </div>
      </form>
    </Form>
  )
}

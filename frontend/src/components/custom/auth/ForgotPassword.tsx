'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2Icon } from 'lucide-react'
import Link from 'next/link'
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

const formSchema = z.object({
  email: z.email({ message: 'Please enter a valid email address.' }),
})

export function ForgotPassword() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onBlur',
  })

  const [resetEmailSend, setResetEmailSend] = React.useState(false)

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await authClient.requestPasswordReset({
        email: values.email,
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      setResetEmailSend(true)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to send email. Please try again.')
      }
    }
  }

  return resetEmailSend ? (
    <div className='flex flex-col gap-6 items-center text-center'>
      <p className='text-2xl font-bold text-muted-foreground'>
        An email with the reset instructions has been sent! Please check your
        inbox.
      </p>
      <Button asChild>
        <Link href='/auth/login'>Back to Login</Link>
      </Button>
    </div>
  ) : (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-6'
      >
        <div className='flex flex-col items-center gap-2'>
          <h1 className='text-2xl font-bold'>Forgot your password?</h1>
          <p className='text-muted-foreground text-sm'>
            Enter your details to request for a password reset email
          </p>
        </div>

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

        <Button
          type='submit'
          className='w-full'
          disabled={form.formState.isSubmitting || !form.formState.isValid}
        >
          {form.formState.isSubmitting && (
            <Loader2Icon className='animate-spin' />
          )}
          Request rest link
        </Button>

        <div className='text-center text-sm'>
          <Link href='/auth/login' className='underline underline-offset-4'>
            Back to Login
          </Link>
        </div>
      </form>
    </Form>
  )
}

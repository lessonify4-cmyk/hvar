import { signIn } from '@/lib/auth'
import { AuthError } from 'next-auth'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Link from 'next/link'

export const metadata = {
  title: 'Login | HvarLive',
  description: 'Log in to your HvarLive account',
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[var(--cream)]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--sea)] font-playfair">
            HvarLive
          </h2>
        </Link>
        <h2 className="mt-2 text-center text-2xl font-bold tracking-tight text-[var(--ink)]">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-[var(--muted)]">
          Or{' '}
          <Link href="/register" className="font-medium text-[var(--sea)] hover:text-[var(--sea-dark)]">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {searchParams.error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-md">
              Invalid email or password. Please try again.
            </div>
          )}

          <form
            action={async (formData) => {
              'use server'
              let errorType = null;
              try {
                await signIn('credentials', Object.fromEntries(formData), { redirectTo: '/dashboard' })
              } catch (error) {
                if (error instanceof AuthError) {
                  errorType = error.type;
                } else {
                  // Rethrow NEXT_REDIRECT and other unhandled errors
                  throw error
                }
              }
              
              if (errorType === 'CredentialsSignin') {
                redirect('/login?error=CredentialsSignin')
              } else if (errorType) {
                redirect('/login?error=Configuration')
              }
            }}
            className="space-y-6"
          >
            <div>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                label="Email address"
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                label="Password"
                placeholder="••••••••"
              />
            </div>

            <div>
              <Button type="submit" className="w-full">
                Sign in
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

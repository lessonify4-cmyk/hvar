import { signIn } from '@/lib/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Register | HvarLive',
  description: 'Create a new HvarLive account',
}

export default function RegisterPage({
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
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-[var(--muted)]">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-[var(--sea)] hover:text-[var(--sea-dark)]">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {searchParams.error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-md">
              Registration failed. Check if your email is already registered.
            </div>
          )}

          <form
            action={async (formData) => {
              'use server'
              const name = formData.get('name') as string
              const email = formData.get('email') as string
              const password = formData.get('password') as string
              
              if (!email || !password) return redirect('/register?error=missing_fields')
              
              try {
                // Call our API route to handle the secure creation and hashing
                const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
                const res = await fetch(`${appUrl}/api/auth/register`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name, email, password }),
                  cache: 'no-store'
                })
                
                if (!res.ok) {
                  return redirect('/register?error=registration_failed')
                }
              } catch (error) {
                return redirect('/register?error=registration_error')
              }
              
              // Automatically sign in after registration
              await signIn('credentials', { email, password, redirectTo: '/dashboard' })
            }}
            className="space-y-6"
          >
            <div>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                label="Full name"
                placeholder="John Doe"
              />
            </div>

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
                autoComplete="new-password"
                required
                label="Password"
                placeholder="••••••••"
              />
            </div>

            <div>
              <Button type="submit" className="w-full">
                Register
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

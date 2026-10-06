'use client'

import { useState, useActionState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { ArrowLeft, ArrowRight, Sparkles, Lock, Mail, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { loginAction, signupAction, AuthState } from './actions'

const initialState: AuthState = {
  error: null,
  message: null,
}

function AuthForm() {
  const searchParams = useSearchParams()
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login'
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode)

  const [loginState, loginDispatch, isLoginPending] = useActionState(loginAction, initialState)
  const [signupState, signupDispatch, isSignupPending] = useActionState(signupAction, initialState)

  const activeState = mode === 'signup' ? signupState : loginState
  const isPending = mode === 'signup' ? isSignupPending : isLoginPending
  const currentAction = mode === 'signup' ? signupDispatch : loginDispatch

  const [googleLoading, setGoogleLoading] = useState(false)
  const supabase = createClient()

  async function handleGoogleLogin() {
    setGoogleLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      alert(error.message)
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FFFDFB] flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden">
      {/* Peach Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FFEAE4]/80 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-[#FFD5C8]/40 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Header / Back */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6E554F] hover:text-[#221513] bg-white px-3 py-1.5 rounded-full border border-[#FFEAE4] shadow-xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md mx-auto my-auto py-6">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-black text-[#221513] tracking-tight">
            {mode === 'signup' ? 'Create your host account' : 'Welcome back to Pixlane'}
          </h1>
          <p className="text-xs sm:text-sm text-[#6E554F] mt-1">
            {mode === 'signup'
              ? 'Start collecting real-time photos for all your events'
              : 'Sign in to manage your active event galleries'}
          </p>
        </div>

        <div className="bg-white border border-[#FFEAE4] rounded-3xl p-6 sm:p-8 shadow-xl shadow-[#FF7654]/5">
          {/* Mode Switcher Tabs */}
          <div className="flex bg-[#FFF6F3] p-1 rounded-2xl border border-[#FFEAE4] mb-6">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                mode === 'login'
                  ? 'bg-white text-[#221513] shadow-xs'
                  : 'text-[#6E554F] hover:text-[#221513]'
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                mode === 'signup'
                  ? 'bg-white text-[#221513] shadow-xs'
                  : 'text-[#6E554F] hover:text-[#221513]'
              }`}
            >
              Sign up
            </button>
          </div>

          {/* Google 1-Tap OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full py-3 px-4 rounded-2xl bg-white border border-[#FFEAE4] hover:border-[#FF7654]/40 hover:bg-[#FFFDFB] text-[#221513] font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-3 disabled:opacity-60 mb-5"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-5">
            <div className="border-t border-[#FFEAE4] w-full" />
            <span className="bg-white px-3 text-[11px] font-bold text-[#6E554F]/70 uppercase tracking-wider absolute">
              or continue with email
            </span>
          </div>

          <form action={currentAction} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-[#221513] uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#FF7654] absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    name="fullName"
                    placeholder="e.g. Kavindu Perera"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FFFDFB] border border-[#FFD5C8] text-[#221513] placeholder-[#A83013]/40 focus:outline-none focus:ring-2 focus:ring-[#FF7654] focus:border-transparent text-sm transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#221513] uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#FF7654] absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="email"
                  name="email"
                  placeholder="you@gmail.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FFFDFB] border border-[#FFD5C8] text-[#221513] placeholder-[#A83013]/40 focus:outline-none focus:ring-2 focus:ring-[#FF7654] focus:border-transparent text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#221513] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#FF7654] absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FFFDFB] border border-[#FFD5C8] text-[#221513] placeholder-[#A83013]/40 focus:outline-none focus:ring-2 focus:ring-[#FF7654] focus:border-transparent text-sm transition-all"
                />
              </div>
            </div>

            {activeState?.error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-2xl leading-relaxed">
                {activeState.error}
              </div>
            )}

            {activeState?.message && (
              <div className="p-3 bg-[#FFEAE4] border border-[#FFD5C8] text-[#D43E19] text-xs font-semibold rounded-2xl flex items-center gap-2 leading-relaxed">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>{activeState.message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-2 bg-gradient-to-r from-[#FF7654] to-[#FFA387] hover:from-[#F45732] hover:to-[#FF8E72] text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-md shadow-[#FF7654]/25 hover:shadow-lg hover:shadow-[#FF7654]/30 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition-all text-sm flex items-center justify-center gap-2"
            >
              <span>{isPending ? 'Please wait...' : mode === 'signup' ? 'Create Free Account' : 'Sign in to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      <footer className="text-center text-xs text-[#6E554F] py-2">
        Pixlane &bull; Event photo sharing made for Sri Lanka 🇱🇰
      </footer>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  )
}

'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { Camera, ArrowLeft, ArrowRight, Sparkles, Lock, Mail, User } from 'lucide-react'

function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<'login' | 'signup'>(
    searchParams.get('mode') === 'signup' ? 'signup' : 'login'
  )
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { full_name: fullName.trim() } },
        })

        if (error) {
          setError(error.message)
        } else if (data?.session) {
          // Email auto-confirmed (or email confirmation disabled in Supabase)
          window.location.href = '/dashboard'
          return
        } else {
          // Supabase project has "Confirm Email" turned ON
          setMessage(
            'Account created! Please check your email for the confirmation link. (Tip: You can disable "Confirm email" in your Supabase Auth dashboard for instant mobile signup).'
          )
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })

        if (error) {
          if (error.message.toLowerCase().includes('email not confirmed')) {
            setError('Please confirm your email address before signing in, or turn off "Confirm email" in Supabase Auth Settings.')
          } else {
            setError(error.message)
          }
        } else {
          // Hard navigation to guarantee cookies are flushed across mobile browsers and tunnels
          window.location.href = '/dashboard'
          return
        }
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
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
              onClick={() => { setMode('login'); setError(''); setMessage('') }}
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
              onClick={() => { setMode('signup'); setError(''); setMessage('') }}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                mode === 'signup'
                  ? 'bg-white text-[#221513] shadow-xs'
                  : 'text-[#6E554F] hover:text-[#221513]'
              }`}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-[#221513] uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#FF7654] absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FFFDFB] border border-[#FFD5C8] text-[#221513] placeholder-[#A83013]/40 focus:outline-none focus:ring-2 focus:ring-[#FF7654] focus:border-transparent text-sm transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-2xl">
                {error}
              </div>
            )}

            {message && (
              <div className="p-3 bg-[#FFEAE4] border border-[#FFD5C8] text-[#D43E19] text-xs font-semibold rounded-2xl flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>{message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-[#FF7654] to-[#FFA387] hover:from-[#F45732] hover:to-[#FF8E72] text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-md shadow-[#FF7654]/25 hover:shadow-lg hover:shadow-[#FF7654]/30 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition-all text-sm flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Please wait...' : mode === 'signup' ? 'Create Free Account' : 'Sign in to Dashboard'}</span>
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

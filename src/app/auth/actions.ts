'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export type AuthState = {
  error?: string | null
  message?: string | null
}

export async function loginAction(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Please enter both email and password.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    if (error.message.toLowerCase().includes('email not confirmed')) {
      return {
        error: 'Email not confirmed yet. Please check your email or disable "Confirm email" in Supabase Auth Settings.',
      }
    }
    return { error: error.message }
  }

  redirect('/dashboard')
}

export async function signupAction(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string
  const fullName = (formData.get('fullName') as string)?.trim() || ''

  if (!email || !password) {
    return { error: 'Please enter email and password.' }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data?.session) {
    redirect('/dashboard')
  }

  return {
    message: 'Account created! Please check your email for the confirmation link, or turn off "Confirm email" in Supabase dashboard for instant login.',
  }
}

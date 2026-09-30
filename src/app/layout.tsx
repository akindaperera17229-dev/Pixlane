import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'Pixlane — Every angle. One place.',
  description: "Capture & collect high-res memories from every friend without quality loss. Zero app download required.",
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Pixlane',
  },
  openGraph: {
    title: 'Pixlane',
    description: 'Share your event moments in full resolution — no app needed.',
    type: 'website',
  },
}

// Peach theme color for browser tab bar / mobile status bar
export const viewport: Viewport = {
  themeColor: '#FF7654',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={jakarta.variable} suppressHydrationWarning>
      <body className="font-sans bg-[#FFFDFB] text-[#221513] antialiased selection:bg-[#FFEAE4] selection:text-[#D43E19]">
        {children}
      </body>
    </html>
  )
}

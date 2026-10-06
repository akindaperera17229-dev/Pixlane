import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Plus_Jakarta_Sans, Lora, Italianno, Cinzel_Decorative } from 'next/font/google'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700', '800'],
})

const lora = Lora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lora',
  weight: ['400', '500', '600', '700'],
  preload: false,
})

const italianno = Italianno({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-italianno',
  weight: ['400'],
  preload: false,
})

const cinzel = Cinzel_Decorative({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cinzel',
  weight: ['400', '700', '900'],
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
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'Pixlane',
    description: 'Share your event moments in full resolution — no app needed.',
    type: 'website',
    images: ['/logo.png'],
  },
}

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
    <html
      lang="en"
      className={`${jakarta.variable} ${lora.variable} ${italianno.variable} ${cinzel.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans bg-[#FFFDFB] text-[#221513] antialiased selection:bg-[#FFEAE4] selection:text-[#D43E19]">
        {children}
        <Script src="https://www.payhere.lk/lib/payhere.js" strategy="lazyOnload" />
      </body>
    </html>
  )
}

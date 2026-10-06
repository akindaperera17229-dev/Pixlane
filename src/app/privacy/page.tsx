import Link from 'next/link'
import Logo from '@/components/Logo'
import { ArrowLeft, Shield, Lock, Eye, Database, Mail } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy — Pixlane',
  description: 'Official privacy and data protection policy for Pixlane.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FFFDFB] text-[#221513] flex flex-col justify-between">
      {/* Top Header */}
      <header className="bg-white border-b border-[#FFEAE4] sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <Logo size="responsive" href="/" />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6E554F] hover:text-[#221513] bg-[#FFF6F3] px-3.5 py-1.5 rounded-full border border-[#FFEAE4] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Legal Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 flex-1">
        <div className="inline-flex items-center gap-2 bg-[#FFEAE4] text-[#D43E19] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
          <Shield className="w-3.5 h-3.5" />
          <span>Data Protection & Privacy Standards</span>
        </div>

        <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#221513] tracking-wide mb-3">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-[#6E554F] mb-8">
          Last updated: October 2026 &bull; Effective for all users of https://pixlane.site
        </p>

        <div className="bg-white rounded-3xl border border-[#FFEAE4] p-6 sm:p-10 shadow-sm space-y-8 text-sm text-[#4A3B37] leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-bold text-lg text-[#221513] flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#FF7654]" />
              <span>1. Information We Collect</span>
            </h2>
            <p>
              When you use Pixlane (<Link href="https://pixlane.site" className="text-[#D43E19] underline font-semibold">https://pixlane.site</Link>), we collect only the necessary information required to deliver our event photo and video sharing service:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li><strong>Host Account Data:</strong> Your name, email address, and authentication credentials when you register or sign in via Google.</li>
              <li><strong>Guest Upload Data:</strong> Guest nickname or display name entered during media uploads. No mandatory app registration or phone number is required from guests.</li>
              <li><strong>Event Media Content:</strong> Photos and video files uploaded by the host and authorized guests for a specific event album.</li>
              <li><strong>Transaction Data:</strong> Billing name, email, phone number, and PayHere Order IDs. We <strong>never</strong> store your credit/debit card numbers or CVV codes on our servers.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-bold text-lg text-[#221513] flex items-center gap-2">
              <Database className="w-5 h-5 text-[#FF7654]" />
              <span>2. How We Use Your Information</span>
            </h2>
            <p>Your data is used strictly for the following purposes:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li>Providing private, high-resolution event albums, live slideshow feeds, and QR code access.</li>
              <li>Facilitating secure transactions and plan upgrades via PayHere.</li>
              <li>Preventing spam, abusive uploads, and unauthorized access.</li>
              <li>Sending necessary account notifications such as password resets and payment receipts.</li>
            </ul>
            <p className="font-semibold text-[#D43E19]">
              We never sell, rent, or trade your personal data or event photos to any third-party advertisers or data brokers.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="font-bold text-lg text-[#221513] flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#FF7654]" />
              <span>3. Media Storage & Security</span>
            </h2>
            <p>
              All event photos and videos are stored in encrypted, high-availability object storage powered by <strong>Cloudflare R2</strong> and <strong>Supabase</strong>. 
            </p>
            <p>
              Access to event galleries is strictly governed by the host’s unique event code and link. Hosts retain the right to close uploads, delete individual photos, or permanently remove the entire event album at any time.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-bold text-lg text-[#221513]">4. Third-Party Service Providers</h2>
            <p>
              We integrate with trusted enterprise infrastructure partners to provide secure platform operations:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li><strong>PayHere (Payment Gateway):</strong> Handles credit card, debit card, and mobile wallet transactions under Central Bank of Sri Lanka (CBSL) standards.</li>
              <li><strong>Cloudflare R2:</strong> High-speed, encrypted global media CDN and file storage.</li>
              <li><strong>Supabase:</strong> Encrypted PostgreSQL database and authentication infrastructure.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="font-bold text-lg text-[#221513]">5. Your Data Rights & Deletion</h2>
            <p>
              As a user or event host, you have the full right to request a complete export of your data, or request permanent deletion of your account and all associated event media. Such requests are fulfilled promptly.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 pt-4 border-t border-[#FFEAE4]">
            <h2 className="font-bold text-lg text-[#221513] flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#FF7654]" />
              <span>6. Contact Our Privacy Officer</span>
            </h2>
            <p>
              If you have any questions or concerns regarding our privacy practices, please contact us:
            </p>
            <div className="bg-[#FFF6F3] p-4 rounded-2xl border border-[#FFEAE4] text-xs sm:text-sm space-y-1">
              <p><strong>Email:</strong> privacy@pixlane.site</p>
              <p><strong>Platform:</strong> https://pixlane.site</p>
              <p><strong>Location:</strong> Colombo, Sri Lanka 🇱🇰</p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#FFEAE4] bg-white py-6 text-center text-xs text-[#6E554F]">
        &copy; {new Date().getFullYear()} Pixlane (https://pixlane.site). Your privacy and memories are always respected and protected.
      </footer>
    </div>
  )
}

import Link from 'next/link'
import Logo from '@/components/Logo'
import { ArrowLeft, FileText, CheckCircle2, AlertTriangle, ShieldCheck, Mail } from 'lucide-react'

export const metadata = {
  title: 'Terms & Conditions — Pixlane',
  description: 'Official Terms of Service and user agreement for Pixlane.',
}

export default function TermsPage() {
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
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>User Agreement & Merchant Terms</span>
        </div>

        <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#221513] tracking-wide mb-3">
          Terms & Conditions
        </h1>
        <p className="text-xs sm:text-sm text-[#6E554F] mb-8">
          Last updated: October 2026 &bull; Governed under the laws of the Democratic Socialist Republic of Sri Lanka
        </p>

        <div className="bg-white rounded-3xl border border-[#FFEAE4] p-6 sm:p-10 shadow-sm space-y-8 text-sm text-[#4A3B37] leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-bold text-lg text-[#221513] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#FF7654]" />
              <span>1. Agreement to Terms</span>
            </h2>
            <p>
              By accessing or using Pixlane (<Link href="https://pixlane.site" className="text-[#D43E19] underline font-semibold">https://pixlane.site</Link>), you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the service.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-bold text-lg text-[#221513] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#FF7654]" />
              <span>2. Description of Services & Pricing</span>
            </h2>
            <p>
              Pixlane provides real-time event photo and video collection software. Hosts may create events and purchase one-time event passes:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li><strong>Outing Free Pass (Rs. 0):</strong> Up to 60 photos, 10 short videos, 30 days active gallery storage.</li>
              <li><strong>Party Pro Pass (Rs. 1,900 one-time):</strong> Up to 300 photos, 30 HD videos, 90 days active storage, animated theme backgrounds, bulk ZIP downloads.</li>
              <li><strong>Wedding & Grand Pass (Rs. 4,900 one-time):</strong> Unlimited photos, unlimited HD/4K videos, 1 full year cloud archive guarantee, table stand QR access.</li>
            </ul>
            <p>
              All prices are listed in Sri Lankan Rupees (LKR) and billed securely via <strong>PayHere</strong>. There are no recurring surprise charges; passes are single one-time payments per event.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="font-bold text-lg text-[#221513] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#FF7654]" />
              <span>3. Content Ownership & Rights</span>
            </h2>
            <p>
              <strong>You retain 100% ownership</strong> of all photographs, video recordings, and media you upload to Pixlane. By uploading, you grant Pixlane only the non-exclusive technical license required to host, display, and deliver your files to your authorized guests. We do not claim any copyright or proprietary interest in your event content.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-bold text-lg text-[#221513] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#FF7654]" />
              <span>4. Acceptable Use Policy</span>
            </h2>
            <p>Users agree not to upload, store, or share:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li>Sexually explicit, pornographic, or obscene content.</li>
              <li>Content promoting violence, hate speech, defamation, or illegal activities.</li>
              <li>Files containing malicious code, viruses, or disruptive malware.</li>
              <li>Media that infringes upon third-party copyrights or trademarks without permission.</li>
            </ul>
            <p>
              Pixlane reserves the right to immediately terminate access and remove offending content that violates this policy.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="font-bold text-lg text-[#221513]">5. Payments & Security</h2>
            <p>
              All electronic payment transactions are facilitated through PayHere, an authorized payment facilitator supervised by the Central Bank of Sri Lanka (CBSL). Pixlane does not collect or retain card credentials.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="font-bold text-lg text-[#221513]">6. Limitation of Liability & Governing Law</h2>
            <p>
              Pixlane shall not be held liable for indirect, incidental, or consequential damages resulting from lost files, venue connectivity blackouts, or unauthorized sharing of the public event code by event guests.
            </p>
            <p>
              These Terms shall be interpreted and governed in accordance with the laws of the <strong>Democratic Socialist Republic of Sri Lanka</strong>.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3 pt-4 border-t border-[#FFEAE4]">
            <h2 className="font-bold text-lg text-[#221513] flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#FF7654]" />
              <span>7. Contact Information</span>
            </h2>
            <p>For any legal inquiries regarding these terms, contact us at:</p>
            <div className="bg-[#FFF6F3] p-4 rounded-2xl border border-[#FFEAE4] text-xs sm:text-sm space-y-1">
              <p><strong>Email:</strong> legal@pixlane.site</p>
              <p><strong>Platform:</strong> https://pixlane.site</p>
              <p><strong>Headquarters:</strong> Colombo, Sri Lanka 🇱🇰</p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#FFEAE4] bg-white py-6 text-center text-xs text-[#6E554F]">
        &copy; {new Date().getFullYear()} Pixlane (https://pixlane.site). All rights reserved.
      </footer>
    </div>
  )
}

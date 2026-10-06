import Link from 'next/link'
import Logo from '@/components/Logo'
import { ArrowLeft, ShieldCheck, RefreshCw, Clock, Mail } from 'lucide-react'

export const metadata = {
  title: 'Return & Refund Policy — Pixlane',
  description: 'Official cancellation and refund policy for Pixlane digital event passes.',
}

export default function RefundPolicyPage() {
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
          <span>PayHere & CBSL Compliant Policy</span>
        </div>

        <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#221513] tracking-wide mb-3">
          Return, Refund & Cancellation Policy
        </h1>
        <p className="text-xs sm:text-sm text-[#6E554F] mb-8">
          Last updated: October 2026 &bull; Effective for all Pixlane Digital Event Passes
        </p>

        <div className="bg-white rounded-3xl border border-[#FFEAE4] p-6 sm:p-10 shadow-sm space-y-8 text-sm text-[#4A3B37] leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-bold text-lg text-[#221513] flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-[#FF7654]" />
              <span>1. Overview of Digital Services</span>
            </h2>
            <p>
              Pixlane (<Link href="https://pixlane.site" className="text-[#D43E19] underline font-semibold">https://pixlane.site</Link>) provides digital cloud storage, live QR gallery access, and photo/video sharing services for weddings, parties, and gatherings. Customers purchase digital event passes (including the <strong>Party Pro Pass</strong> and <strong>Wedding Pass</strong>) to unlock elevated cloud capacities, video limits, and high-speed downloads.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-bold text-lg text-[#221513] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#FF7654]" />
              <span>2. 7-Day Money-Back Guarantee</span>
            </h2>
            <p>
              We want you to be completely satisfied with your event experience. If you experience technical failure on our platform that prevents you from collecting or downloading your event photos and videos, you are eligible for a <strong>100% full refund</strong> within <strong>7 days</strong> of your purchase date.
            </p>
            <p>
              To request a refund under our guarantee, simply contact our support desk with your Event Code and PayHere Order ID.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="font-bold text-lg text-[#221513]">3. Cancellation Prior to Event Date</h2>
            <p>
              If your wedding, party, or trip is postponed or cancelled before your scheduled event date, you may request either:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li><strong>Free Date Transfer:</strong> Re-allocate your pass to any future event date with zero penalty fees.</li>
              <li><strong>Full Cancellation:</strong> Request a complete refund prior to the event date, provided the gallery has not been utilized for active event uploads.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-bold text-lg text-[#221513]">4. Non-Refundable Situations</h2>
            <p>Refunds will not be issued in the following instances:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li>Requests made after the 7-day post-purchase window when the event has concluded successfully.</li>
              <li>Instances where the host has already utilized the full storage quota and downloaded the complete event ZIP archive.</li>
              <li>Failure by guests to upload media due to lack of local guest internet connectivity at the venue.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="font-bold text-lg text-[#221513]">5. Refund Processing Timeframe</h2>
            <p>
              Once your refund request is received and verified, we process it immediately through our payment partner, <strong>PayHere</strong>. 
            </p>
            <p>
              The refunded amount will reflect back on your original payment method (Visa, MasterCard, FriMi, Genie, or Bank Account) within <strong>5 to 10 business days</strong>, depending on your card issuer or banking institution.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 pt-4 border-t border-[#FFEAE4]">
            <h2 className="font-bold text-lg text-[#221513] flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#FF7654]" />
              <span>6. Contact Us for Refunds & Cancellations</span>
            </h2>
            <p>
              If you have any questions regarding your purchase or wish to initiate a cancellation, reach out to our team:
            </p>
            <div className="bg-[#FFF6F3] p-4 rounded-2xl border border-[#FFEAE4] text-xs sm:text-sm space-y-1">
              <p><strong>Email:</strong> support@pixlane.site</p>
              <p><strong>Website:</strong> https://pixlane.site</p>
              <p><strong>Location:</strong> Colombo, Sri Lanka 🇱🇰</p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#FFEAE4] bg-white py-6 text-center text-xs text-[#6E554F]">
        &copy; {new Date().getFullYear()} Pixlane (https://pixlane.site). Regulated in accordance with Central Bank of Sri Lanka electronic payment guidelines.
      </footer>
    </div>
  )
}

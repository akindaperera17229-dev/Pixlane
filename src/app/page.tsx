import Link from 'next/link'
import { Camera, Users, Download, Zap, QrCode, ImageIcon } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Nav ── */}
      <header className="border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur z-50">
        <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-teal-700 tracking-tight">
            Pixlane
          </span>
          <div className="flex items-center gap-3">
            <Link
              href="/auth"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/auth?mode=signup"
              className="bg-teal-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Get started free
            </Link>
          </div>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-4 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 text-sm font-medium px-3 py-1 rounded-full mb-6">
          <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
          Built for Sri Lanka 🇱🇰
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
          Every angle.{' '}
          <span className="text-teal-600">One place.</span>
        </h1>

        <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Create an event. Share a QR code. Everyone uploads their photos —
          no app download, no account needed. Your wedding, trip, or party,
          seen from every angle.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/auth?mode=signup"
            className="bg-teal-600 text-white font-semibold px-8 py-4 rounded-xl hover:bg-teal-700 transition-colors text-lg"
          >
            Create your first event →
          </Link>
          <Link
            href="#how-it-works"
            className="text-gray-600 font-medium px-8 py-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors text-lg"
          >
            See how it works
          </Link>
        </div>

        <p className="mt-4 text-sm text-gray-400">
          Free forever for small events · No credit card needed
        </p>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900">How Pixlane works</h2>
            <p className="mt-3 text-gray-500 text-lg">Three steps. That&apos;s it.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-6 h-6" />,
                step: '01',
                title: 'Create your event',
                desc: 'Name your event, pick a date, done. Takes less than 30 seconds.',
              },
              {
                icon: <QrCode className="w-6 h-6" />,
                step: '02',
                title: 'Share the QR code',
                desc: 'Your guests scan the QR or open the link. No app download, no sign-up.',
              },
              {
                icon: <ImageIcon className="w-6 h-6" />,
                step: '03',
                title: 'Everyone sees everything',
                desc: 'All photos land in one live gallery. Download the full album any time.',
              },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <div className="text-xs font-bold text-teal-500 mb-2 tracking-widest">STEP {item.step}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900">Everything you need</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: <Camera />, title: 'No app needed', desc: 'Guests upload straight from their browser. Works on any phone.' },
            { icon: <Users />, title: 'All in one gallery', desc: 'Every photo from every guest, in one beautiful shared space.' },
            { icon: <Download />, title: 'Bulk download', desc: 'Download the full album as a ZIP with original quality — no compression.' },
            { icon: <QrCode />, title: 'QR code sharing', desc: 'Display the QR at your venue. Guests scan and start uploading instantly.' },
            { icon: <Zap />, title: 'Live gallery', desc: 'Photos appear in real-time as guests upload — watch the gallery grow.' },
            { icon: <ImageIcon />, title: 'Original quality', desc: 'We store your photos at full resolution. No WhatsApp-style compression.' },
          ].map((f) => (
            <div key={f.title} className="p-6 rounded-xl border border-gray-100 hover:border-teal-100 hover:bg-teal-50/30 transition-all">
              <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-lg flex items-center justify-center mb-3">
                {f.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-teal-600 py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white">
            Ready for your next event?
          </h2>
          <p className="mt-4 text-teal-100 text-lg">
            Free for events up to 30 photos. No card needed.
          </p>
          <Link
            href="/auth?mode=signup"
            className="mt-8 inline-block bg-white text-teal-700 font-bold px-8 py-4 rounded-xl hover:bg-teal-50 transition-colors text-lg"
          >
            Create your first event →
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-bold text-teal-700">Pixlane</span>
          <p className="text-sm text-gray-400">© 2026 Pixlane · Made with ❤️ in Sri Lanka 🇱🇰</p>
        </div>
      </footer>
    </div>
  )
}

import Link from "next/link";
import {
  Camera,
  Download,
  Share2,
  Zap,
  Shield,
  Globe,
  Star,
  Check,
  X,
  ArrowRight,
  Images,
  Users,
  Sparkles,
  QrCode,
  Lock,
  Infinity,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">
      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ NAV â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-gray-950/70 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:shadow-amber-500/50 transition-shadow">
              <Camera className="w-5 h-5 text-gray-950" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Pixlane
            </span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <Link href="#how" className="hover:text-white transition-colors">How it works</Link>
            <Link href="#occasions" className="hover:text-white transition-colors">Occasions</Link>
            <Link href="#compare" className="hover:text-white transition-colors">Why Pixlane</Link>
          </div>

          {/* CTA buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/auth"
              className="hidden sm:inline-flex text-sm font-semibold text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5"
            >
              Sign in
            </Link>
            <Link
              href="/auth?mode=signup"
              className="inline-flex items-center gap-2 text-sm font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-gray-950 px-5 py-2.5 rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/50 hover:scale-105 transition-all duration-200"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ HERO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d0d1f] via-[#110820] to-[#1a0a2e]" />

        {/* Radial glow blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center w-full">
          {/* Left: Copy */}
          <div className="flex flex-col gap-6">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 self-start bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              Made for Sri Lankan Moments
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-black leading-[1.05] tracking-tight">
              Every Shot.{" "}
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-orange-500 bg-clip-text text-transparent">
                Perfectly Shared.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg text-gray-400 leading-relaxed max-w-lg">
              Pixlane is the{" "}
              <span className="text-teal-400 font-semibold">premium event photo hub</span>{" "}
              built for Sri Lankan weddings, birthday bashes, temple festivals, uni batch trips â€” every moment that matters.
              Full-quality photos. Zero hassle. Instant access.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <Link
                href="/auth?mode=signup"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-gray-950 font-black text-base px-8 py-4 rounded-2xl shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 transition-all duration-200"
              >
                Start Sharing Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#how"
                className="inline-flex items-center justify-center gap-2 border border-white/10 text-white font-semibold text-base px-8 py-4 rounded-2xl hover:bg-white/5 hover:border-white/20 transition-all duration-200"
              >
                <Images className="w-5 h-5 text-teal-400" /> See how it works
              </Link>
            </div>

            {/* Social proof strip */}
            <div className="flex items-center gap-6 pt-2">
              <div className="flex -space-x-2">
                {["bg-amber-400", "bg-teal-400", "bg-orange-400", "bg-purple-400"].map((c, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-gray-950 ${c} flex items-center justify-center text-gray-950 text-xs font-black`}>
                    {["A", "B", "C", "D"][i]}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-400">
                Trusted by <span className="text-white font-bold">1,200+</span> event hosts
              </p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Floating photo grid mockup */}
          <div className="relative flex items-center justify-center h-[520px]">
            {/* Main card / gallery container */}
            <div className="relative w-[340px] sm:w-[400px]">
              {/* Browser-ish chrome */}
              <div className="bg-gray-900/80 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
                {/* Top bar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-gray-900">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  <div className="flex-1 mx-4 bg-gray-800 rounded-md px-3 py-1 text-xs text-gray-500 font-mono">
                    pixlane.app/event/sl-wedding
                  </div>
                </div>
                {/* Gallery grid */}
                <div className="p-4 grid grid-cols-3 gap-2">
                  {[
                    "from-amber-400 to-orange-500",
                    "from-teal-400 to-cyan-500",
                    "from-purple-400 to-pink-500",
                    "from-rose-400 to-orange-400",
                    "from-indigo-400 to-blue-500",
                    "from-green-400 to-teal-500",
                    "from-yellow-400 to-amber-500",
                    "from-pink-400 to-rose-500",
                    "from-sky-400 to-indigo-500",
                  ].map((grad, i) => (
                    <div
                      key={i}
                      className={`bg-gradient-to-br ${grad} rounded-xl aspect-square flex items-center justify-center opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-200 cursor-pointer`}
                    >
                      <Camera className="w-5 h-5 text-white/60" />
                    </div>
                  ))}
                </div>
                {/* Bottom info bar */}
                <div className="px-4 pb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">Perera Wedding 2026 ðŸ’</p>
                    <p className="text-xs text-gray-500">247 photos Â· 18 contributors</p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-lg">
                    <Share2 className="w-3.5 h-3.5" /> Share
                  </div>
                </div>
              </div>

              {/* Floating notification card */}
              <div className="absolute -top-6 -right-8 bg-gray-800/90 backdrop-blur border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl shadow-black/40 w-52">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-gray-950" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">New photo added!</p>
                  <p className="text-[10px] text-gray-400">Kasun shared 12 shots</p>
                </div>
              </div>

              {/* Floating QR card */}
              <div className="absolute -bottom-6 -left-8 bg-gray-800/90 backdrop-blur border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl shadow-black/40 w-48">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center shrink-0">
                  <QrCode className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Scan to join</p>
                  <p className="text-[10px] text-gray-400">No app needed</p>
                </div>
              </div>

              {/* Upload count pill */}
              <div className="absolute top-1/2 -left-12 bg-gradient-to-r from-amber-400 to-orange-500 text-gray-950 text-xs font-black px-3 py-2 rounded-xl shadow-lg shadow-amber-500/30 -rotate-6">
                ðŸ“¸ Original quality
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-gray-950 to-transparent pointer-events-none" />
      </section>

      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ STATS STRIP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="relative bg-gray-950 border-y border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          {[
            {
              icon: <Infinity className="w-7 h-7 text-amber-400" />,
              stat: "0% Compression",
              desc: "Every pixel preserved exactly as captured",
            },
            {
              icon: <Zap className="w-7 h-7 text-teal-400" />,
              stat: "Real-time Gallery",
              desc: "Photos appear the moment they're uploaded",
            },
            {
              icon: <Download className="w-7 h-7 text-orange-400" />,
              stat: "No App Download",
              desc: "Works in any browser, share via QR or link",
            },
          ].map(({ icon, stat, desc }, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-3 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-white/20 group-hover:bg-white/8 transition-all duration-300">
                {icon}
              </div>
              <h3 className="text-xl font-black text-white">{stat}</h3>
              <p className="text-sm text-gray-500 max-w-xs">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ OCCASIONS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section id="occasions" className="py-28 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-teal-400/10 border border-teal-400/30 text-teal-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
              <Globe className="w-3.5 h-3.5" /> Sri Lankan Occasions
            </div>
            <h2 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
              Built for{" "}
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                your moments
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              From the poruwa ceremony to the after-party â€” Pixlane captures every scene your community creates.
            </p>
          </div>

          {/* Occasions grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                emoji: "ðŸ’",
                title: "Wedding (Poruwa)",
                desc: "Collect stunning shots from every guest at your poruwa ceremony, reception and mehendi night â€” all in one private gallery.",
                gradient: "from-rose-500/20 to-pink-500/10",
                border: "border-rose-500/20 hover:border-rose-400/40",
                accent: "text-rose-400",
              },
              {
                emoji: "ðŸŽ‚",
                title: "Birthday Bash",
                desc: "Let everyone share their favourite moments from the party. Full-res photos, group selfies, candid shots â€” all saved forever.",
                gradient: "from-amber-500/20 to-orange-500/10",
                border: "border-amber-500/20 hover:border-amber-400/40",
                accent: "text-amber-400",
              },
              {
                emoji: "ðŸŽ“",
                title: "University Batch",
                desc: "Your batch trip, convocation, farewell â€” build a shared album that the whole batch can download long after the day ends.",
                gradient: "from-teal-500/20 to-cyan-500/10",
                border: "border-teal-500/20 hover:border-teal-400/40",
                accent: "text-teal-400",
              },
              {
                emoji: "ðŸ®",
                title: "Temple Festival",
                desc: "Vesak lanterns, Esala Perahera, Avurudu â€” celebrate traditions with a beautiful collaborative gallery everyone can join.",
                gradient: "from-purple-500/20 to-violet-500/10",
                border: "border-purple-500/20 hover:border-purple-400/40",
                accent: "text-purple-400",
              },
              {
                emoji: "ðŸŒ´",
                title: "Office Trip",
                desc: "Your team's team-building trip deserves more than scattered WhatsApp groups. One gallery, every shot, zero drama.",
                gradient: "from-green-500/20 to-emerald-500/10",
                border: "border-green-500/20 hover:border-green-400/40",
                accent: "text-green-400",
              },
              {
                emoji: "âœ¨",
                title: "Any Occasion",
                desc: "Family reunions, school reunions, engagement parties â€” if you're gathering, Pixlane is the photo hub for your crowd.",
                gradient: "from-indigo-500/20 to-blue-500/10",
                border: "border-indigo-500/20 hover:border-indigo-400/40",
                accent: "text-indigo-400",
              },
            ].map(({ emoji, title, desc, gradient, border, accent }) => (
              <div
                key={title}
                className={`relative bg-gradient-to-br ${gradient} border ${border} rounded-3xl p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group`}
              >
                <div className="text-4xl">{emoji}</div>
                <h3 className={`text-lg font-black ${accent}`}>{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
                <div className={`flex items-center gap-1.5 text-xs font-bold ${accent} mt-auto opacity-0 group-hover:opacity-100 transition-opacity`}>
                  Create gallery <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ HOW IT WORKS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section id="how" className="py-28 bg-gradient-to-b from-gray-950 via-[#100820] to-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-orange-400/10 border border-orange-400/30 text-orange-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Simple as 1-2-3
            </div>
            <h2 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
              How{" "}
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Pixlane
              </span>{" "}
              works
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              No complicated setup. No app stores. No data limits. Just beautiful shared galleries in seconds.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-px bg-gradient-to-r from-amber-400/0 via-amber-400/40 to-amber-400/0" />

            {[
              {
                step: "01",
                icon: <Camera className="w-7 h-7 text-gray-950" />,
                bg: "from-amber-400 to-orange-500",
                shadow: "shadow-amber-500/30",
                title: "Create an Event",
                desc: "Give your event a name, set a date, and generate your unique gallery link or QR code in under 30 seconds.",
              },
              {
                step: "02",
                icon: <Share2 className="w-7 h-7 text-gray-950" />,
                bg: "from-teal-400 to-cyan-500",
                shadow: "shadow-teal-500/30",
                title: "Share the Link",
                desc: "Send the link or QR code to all your guests. They open it in any browser â€” no account, no app download required.",
              },
              {
                step: "03",
                icon: <Images className="w-7 h-7 text-gray-950" />,
                bg: "from-purple-400 to-pink-500",
                shadow: "shadow-purple-500/30",
                title: "Collect & Download",
                desc: "Watch the gallery fill up in real time. Download all photos at once in full original quality â€” ready to print or relive.",
              },
            ].map(({ step, icon, bg, shadow, title, desc }, i) => (
              <div
                key={i}
                className="relative flex flex-col items-center text-center gap-5 bg-white/3 border border-white/8 rounded-3xl p-8 hover:bg-white/5 hover:border-white/15 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Step number badge */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] font-black text-gray-600 bg-gray-900 border border-white/10 px-3 py-1 rounded-full">
                  STEP {step}
                </div>
                {/* Icon circle */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${bg} flex items-center justify-center shadow-xl ${shadow} mt-4`}>
                  {icon}
                </div>
                <h3 className="text-xl font-black text-white">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ COMPARISON TABLE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section id="compare" className="py-28 bg-gray-950">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-rose-400/10 border border-rose-400/30 text-rose-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
              <Shield className="w-3.5 h-3.5" /> Why Not WhatsApp?
            </div>
            <h2 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
              Pixlane vs{" "}
              <span className="text-gray-500 line-through decoration-rose-500 decoration-4">
                WhatsApp
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              WhatsApp crushes your photos by up to 70%. Pixlane was built specifically to fix that.
            </p>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-3xl border border-white/10">
            {/* Header */}
            <div className="grid grid-cols-3 bg-gray-900/80 border-b border-white/10">
              <div className="px-6 py-5 text-sm font-bold text-gray-500 uppercase tracking-wider">Feature</div>
              <div className="px-6 py-5 text-center">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-gray-950 font-black text-sm px-4 py-1.5 rounded-full">
                  <Camera className="w-4 h-4" /> Pixlane
                </div>
              </div>
              <div className="px-6 py-5 text-center">
                <span className="text-gray-400 font-bold text-sm">ðŸ’¬ WhatsApp</span>
              </div>
            </div>

            {[
              { feature: "Photo Quality", pixlane: "Original 100%", whatsapp: "Compressed 30-70%", pixlaneGood: true, whatsappGood: false },
              { feature: "Organised Gallery", pixlane: "Event-based gallery", whatsapp: "Scattered in chat", pixlaneGood: true, whatsappGood: false },
              { feature: "Guest Access", pixlane: "Link / QR code", whatsapp: "Must be in group", pixlaneGood: true, whatsappGood: false },
              { feature: "Bulk Download", pixlane: "One-click ZIP", whatsapp: "Save one by one", pixlaneGood: true, whatsappGood: false },
              { feature: "Photo Limit", pixlane: "Unlimited", whatsapp: "Group clutter", pixlaneGood: true, whatsappGood: false },
              { feature: "Privacy Control", pixlane: "Host manages access", whatsapp: "Anyone in group", pixlaneGood: true, whatsappGood: false },
              { feature: "App Required", pixlane: "No â€” browser only", whatsapp: "Yes â€” install required", pixlaneGood: true, whatsappGood: false },
            ].map(({ feature, pixlane, whatsapp, pixlaneGood, whatsappGood }, i) => (
              <div
                key={i}
                className={`grid grid-cols-3 border-b border-white/5 last:border-0 transition-colors ${i % 2 === 0 ? "bg-gray-900/30" : "bg-gray-900/10"} hover:bg-white/3`}
              >
                <div className="px-6 py-4 text-sm font-semibold text-gray-300 flex items-center">{feature}</div>
                <div className="px-6 py-4 flex items-center justify-center gap-2">
                  {pixlaneGood ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-teal-400/20 border border-teal-400/40 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-teal-400" />
                      </div>
                      <span className="text-xs text-gray-300 font-medium">{pixlane}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-rose-400/20 border border-rose-400/40 flex items-center justify-center shrink-0">
                        <X className="w-3 h-3 text-rose-400" />
                      </div>
                      <span className="text-xs text-gray-400">{pixlane}</span>
                    </div>
                  )}
                </div>
                <div className="px-6 py-4 flex items-center justify-center gap-2">
                  {whatsappGood ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-teal-400/20 border border-teal-400/40 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-teal-400" />
                      </div>
                      <span className="text-xs text-gray-300 font-medium">{whatsapp}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-rose-400/20 border border-rose-400/40 flex items-center justify-center shrink-0">
                        <X className="w-3 h-3 text-rose-400" />
                      </div>
                      <span className="text-xs text-gray-400">{whatsapp}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ FEATURES HIGHLIGHT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="py-16 bg-gradient-to-b from-gray-950 to-[#0d0d1f]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <Lock className="w-6 h-6 text-teal-400" />,
              title: "Private & Secure",
              desc: "Your event gallery is only accessible to people you invite. Password-protect or set expiry dates.",
              color: "teal",
            },
            {
              icon: <Users className="w-6 h-6 text-amber-400" />,
              title: "Crowd-sourced Albums",
              desc: "Every guest becomes a photographer. Collect hundreds of angles from one event effortlessly.",
              color: "amber",
            },
            {
              icon: <Download className="w-6 h-6 text-orange-400" />,
              title: "Instant Bulk Download",
              desc: "Download every photo in full resolution with a single click â€” all packed into an organised ZIP.",
              color: "orange",
            },
          ].map(({ icon, title, desc, color }, i) => (
            <div
              key={i}
              className="flex gap-5 items-start p-6 bg-white/3 border border-white/8 rounded-2xl hover:bg-white/5 hover:border-white/15 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl bg-${color}-400/10 border border-${color}-400/20 flex items-center justify-center shrink-0`}>
                {icon}
              </div>
              <div>
                <h3 className="font-black text-white mb-1">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ BOTTOM CTA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a2e] via-[#0d0d1f] to-[#0f1a30]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-6 text-center flex flex-col items-center gap-8">
          <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">
            <Sparkles className="w-3.5 h-3.5" /> Free to get started
          </div>

          <h2 className="text-5xl sm:text-6xl font-black leading-[1.1] tracking-tight">
            Your next event{" "}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-orange-500 bg-clip-text text-transparent">
              deserves better.
            </span>
          </h2>

          <p className="text-lg text-gray-400 max-w-xl leading-relaxed">
            Stop losing memories to WhatsApp compression. Start your first Pixlane gallery in under 60 seconds â€” no credit card, no app, no limits.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/auth?mode=signup"
              className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-amber-400 to-orange-500 text-gray-950 font-black text-lg px-10 py-5 rounded-2xl shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 transition-all duration-200"
            >
              Create Free Gallery <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/auth"
              className="inline-flex items-center justify-center gap-2 border border-white/15 text-white font-semibold text-lg px-10 py-5 rounded-2xl hover:bg-white/5 hover:border-white/25 transition-all duration-200"
            >
              Sign in
            </Link>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 pt-2">
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-teal-400" /> No credit card</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-teal-400" /> No app download</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-teal-400" /> Free forever plan</span>
          </div>
        </div>
      </section>

      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ FOOTER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <footer className="bg-gray-950 border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo + tagline */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Camera className="w-4 h-4 text-gray-950" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-black bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Pixlane
              </span>
            </Link>
            <p className="text-xs text-gray-600">Premium event photo sharing</p>
          </div>

          {/* Footer links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <Link href="#" className="hover:text-gray-300 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-gray-300 transition-colors">Terms</Link>
            <Link href="#" className="hover:text-gray-300 transition-colors">Contact</Link>
            <Link href="#" className="hover:text-gray-300 transition-colors">Blog</Link>
          </div>

          {/* Made in SL */}
          <p className="text-sm text-gray-600">
            Made with <span className="text-rose-400">â¤ï¸</span> in Sri Lanka ðŸ‡±ðŸ‡°
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-8 pt-8 border-t border-white/5 text-center text-xs text-gray-700">
          Â© {new Date().getFullYear()} Pixlane. All rights reserved.
        </div>
      </footer>
    </div>
  );
}


import Link from 'next/link'
import {
  Camera,
  Download,
  Share2,
  Zap,
  Shield,
  Sparkles,
  ArrowRight,
  Images,
  CheckCircle2,
  Smartphone,
  Flame,
  Heart,
  QrCode,
  Users2,
  ChevronRight,
} from 'lucide-react'

// Curated authentic lifestyle & event photos (Unsplash high-res CDN)
const REAL_PHOTOS = {
  heroMain: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80', // Friends laughing at sunset
  heroParty: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=600&q=80', // Birthday sparkler / cake
  heroTrip: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80', // Tropical beach outing
  heroGrad: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80', // Batch hangout
  wedding: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80', // Joyful wedding moment
  trip: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80', // Road trip / Ella trip
  birthday: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80', // Party / Celebration
  festival: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80', // Night festival / lights
  candid: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', // Golden hour smile
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFFDFB] text-[#221513] overflow-x-hidden selection:bg-[#FFEAE4] selection:text-[#D43E19]">
      {/* ─── APP HEADER / NAVIGATION ─── */}
      <header className="sticky top-0 z-50 bg-[#FFFDFB]/85 backdrop-blur-xl border-b border-[#FFEAE4]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#FF7654] to-[#FFA387] flex items-center justify-center text-white shadow-md shadow-[#FF7654]/25 group-hover:scale-105 transition-transform">
              <Camera className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-[#221513] leading-none">
                Pixlane
              </span>
              <span className="text-[10px] font-semibold text-[#FF7654] tracking-wider uppercase mt-0.5">
                Every Angle
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-[#6E554F]">
            <Link href="#how" className="hover:text-[#FF7654] transition-colors">How it works</Link>
            <Link href="#occasions" className="hover:text-[#FF7654] transition-colors">Occasions</Link>
            <Link href="#compare" className="hover:text-[#FF7654] transition-colors">vs WhatsApp</Link>
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/auth"
              className="text-sm font-bold text-[#6E554F] hover:text-[#221513] px-3.5 py-2 rounded-xl hover:bg-[#FFF6F3] transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/auth?mode=signup"
              className="inline-flex items-center gap-1.5 text-sm font-bold bg-[#FF7654] hover:bg-[#F45732] text-white px-4 py-2 rounded-xl shadow-md shadow-[#FF7654]/25 hover:shadow-lg hover:shadow-[#FF7654]/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ─── HERO SECTION (Mobile-First Warm Peach Aesthetic) ─── */}
        <section className="relative pt-8 pb-16 sm:pt-16 sm:pb-24 overflow-hidden">
          {/* Soft Peach Ambient Background Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#FFEBE4]/60 via-[#FFF5F2]/40 to-transparent pointer-events-none rounded-b-[4rem] -z-10" />
          <div className="absolute top-20 right-[-10%] w-72 sm:w-96 h-72 sm:h-96 bg-[#FFD5C8]/40 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute top-40 left-[-10%] w-72 sm:w-96 h-72 sm:h-96 bg-[#FFEAE4]/50 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              
              {/* Left Column: Headline & Value Prop */}
              <div className="lg:col-span-7 flex flex-col items-start text-left">
                {/* Pill Tag */}
                <div className="inline-flex items-center gap-2 bg-[#FFEAE4] border border-[#FFD5C8] text-[#D43E19] text-xs font-bold px-3.5 py-1.5 rounded-full mb-5 shadow-xs">
                  <Flame className="w-3.5 h-3.5 text-[#FF7654]" />
                  <span>The New Way to Share Event Photos 🇱🇰</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#221513] leading-[1.1] mb-5">
                  Stop losing memories to{' '}
                  <span className="relative whitespace-nowrap">
                    <span className="peach-gradient-text">blurry chats.</span>
                    <svg className="absolute -bottom-2 left-0 w-full text-[#FF7654]/40 h-2.5" viewBox="0 0 100 12" preserveAspectRatio="none">
                      <path d="M0,8 Q50,0 100,8" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-[#6E554F] leading-relaxed mb-8 max-w-xl">
                  One QR code. Everyone scans, snaps, and drops their pictures in one live shared gallery. 
                  <strong className="text-[#221513] font-bold"> Zero app download. Original 100% resolution.</strong>
                </p>

                {/* Primary CTA Buttons */}
                <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-8">
                  <Link
                    href="/auth?mode=signup"
                    className="flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#FF7654] to-[#FFA387] hover:from-[#F45732] hover:to-[#FF8E72] text-white font-extrabold text-base px-7 py-3.5 rounded-2xl shadow-lg shadow-[#FF7654]/30 hover:shadow-xl hover:shadow-[#FF7654]/35 hover:-translate-y-0.5 active:translate-y-0 transition-all text-center"
                  >
                    <span>Create Free Event</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>

                  <Link
                    href="#how"
                    className="flex items-center justify-center gap-2 bg-[#FFF6F3] hover:bg-[#FFEAE4] text-[#6E554F] hover:text-[#221513] font-bold text-base px-6 py-3.5 rounded-2xl border border-[#FFD5C8] transition-colors text-center"
                  >
                    <Smartphone className="w-4 h-4 text-[#FF7654]" />
                    <span>See Live Demo</span>
                  </Link>
                </div>

                {/* Social Proof / Teen Trust Badges */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 border-t border-[#FFEAE4] w-full text-xs sm:text-sm text-[#6E554F]">
                  <div className="flex -space-x-2">
                    <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src={REAL_PHOTOS.candid} alt="User" />
                    <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src={REAL_PHOTOS.heroParty} alt="User" />
                    <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src={REAL_PHOTOS.heroGrad} alt="User" />
                  </div>
                  <div>
                    <span className="font-extrabold text-[#221513]">3,400+ photos</span> gathered this week
                  </div>
                  <div className="flex items-center gap-1 text-[#FF7654]">
                    <Sparkles className="w-4 h-4 fill-current" />
                    <span className="font-bold">100% Free for outings</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Smartphone UI Mockup with Real Event Photography */}
              <div className="lg:col-span-5 relative flex justify-center mt-6 lg:mt-0">
                {/* Smartphone Device Shell */}
                <div className="relative w-[300px] sm:w-[330px] rounded-[2.5rem] bg-[#221513] p-3 shadow-2xl shadow-[#FF7654]/20 border-4 border-[#3D0E05]">
                  {/* Phone Screen */}
                  <div className="rounded-[2rem] bg-[#FFFDFB] overflow-hidden border border-[#FFEAE4] text-[#221513] flex flex-col">
                    {/* Mobile App Bar */}
                    <div className="bg-[#FFF6F3] px-4 py-3 border-b border-[#FFEAE4] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FF7654] animate-pulse" />
                        <span className="font-bold text-xs text-[#221513]">Batch Ella Trip &apos;26 🌴</span>
                      </div>
                      <span className="text-[11px] font-bold bg-[#FFEAE4] text-[#D43E19] px-2 py-0.5 rounded-full">
                        Live
                      </span>
                    </div>

                    {/* Photo Grid Preview */}
                    <div className="p-3 grid grid-cols-2 gap-2 bg-[#FFFDFB]">
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-xs group">
                        <img src={REAL_PHOTOS.heroMain} alt="Sunset beach" className="w-full h-full object-cover" />
                        <div className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                          Kaveen 📸
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="relative aspect-square rounded-xl overflow-hidden shadow-xs">
                          <img src={REAL_PHOTOS.heroParty} alt="Party sparklers" className="w-full h-full object-cover" />
                          <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] font-medium px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                            Anu ✨
                          </div>
                        </div>
                        <div className="relative aspect-square rounded-xl overflow-hidden shadow-xs">
                          <img src={REAL_PHOTOS.heroTrip} alt="Coastline hangout" className="w-full h-full object-cover" />
                          <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] font-medium px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                            Sahan 🏖️
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Strip inside Phone */}
                    <div className="p-3 bg-[#FFF6F3] border-t border-[#FFEAE4] flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Images className="w-4 h-4 text-[#FF7654]" />
                        <span className="text-xs font-bold text-[#6E554F]">142 photos</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-[#FF7654] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs">
                        <Camera className="w-3.5 h-3.5" />
                        <span>Add Photo</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Aesthetic Stickers */}
                <div className="absolute -top-4 -left-6 sm:-left-8 bg-white/95 backdrop-blur-md border border-[#FFD5C8] rounded-2xl p-3 shadow-lg flex items-center gap-3 animate-bounce [animation-duration:3s]">
                  <div className="w-10 h-10 rounded-xl bg-[#FFEAE4] flex items-center justify-center text-[#D43E19]">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#221513]">Just scan & drop</p>
                    <p className="text-[11px] text-[#6E554F]">No app install required</p>
                  </div>
                </div>

                <div className="absolute -bottom-4 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md border border-[#FFD5C8] rounded-2xl p-3 shadow-lg flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FFF6F3] text-[#FF7654] flex items-center justify-center">
                    <Heart className="w-5 h-5 fill-[#FF7654]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#221513]">Zero compression</p>
                    <p className="text-[11px] text-[#6E554F]">Original HD quality</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ─── 3 HIGHLIGHT METRICS STRIP ─── */}
        <section className="bg-[#FFF6F3] border-y border-[#FFEAE4] py-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-[#FFD5C8] shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-[#FFEAE4] text-[#D43E19] flex items-center justify-center shrink-0">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#221513]">Instant Real-Time</h3>
                  <p className="text-xs text-[#6E554F] mt-0.5">Photos appear live on the screen as your friends take them.</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-[#FFD5C8] shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-[#FFEAE4] text-[#D43E19] flex items-center justify-center shrink-0">
                  <Download className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#221513]">1-Click ZIP Download</h3>
                  <p className="text-xs text-[#6E554F] mt-0.5">Download every picture in high-res with one tap, or save one by one.</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-[#FFD5C8] shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-[#FFEAE4] text-[#D43E19] flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#221513]">Private & Safe</h3>
                  <p className="text-xs text-[#6E554F] mt-0.5">Only people with your link or QR code can access and contribute.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── OCCASIONS SHOWCASE (With Real Photography) ─── */}
        <section id="occasions" className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold tracking-wider uppercase text-[#FF7654] bg-[#FFEAE4] px-3.5 py-1 rounded-full">
              Made for your lifestyle
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#221513] mt-3 tracking-tight">
              One shared album for every great occasion
            </h2>
            <p className="text-[#6E554F] text-sm sm:text-base mt-2">
              No more bugging your friends for three weeks asking &quot;Machan, send me the outing photos!&quot;
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                title: 'Outings & Beach Trips',
                tag: 'Ella / Mirissa / Trinco',
                img: REAL_PHOTOS.trip,
                emoji: '🌴',
                desc: 'Capture everyone’s selfies, candid moments, and landscape views in one collaborative folder.',
              },
              {
                title: 'Weddings & Poruwa',
                tag: 'Big Celebrations',
                img: REAL_PHOTOS.wedding,
                emoji: '💍',
                desc: 'Print table QR cards. Every guest uploads their candid shots while the official photographer does their work.',
              },
              {
                title: 'Birthday Bashes',
                tag: 'Friends & Family',
                img: REAL_PHOTOS.birthday,
                emoji: '🎂',
                desc: 'Cake cuts, dance moves, group cheers — every friend’s camera angle in one place.',
              },
              {
                title: 'Batches & Festivals',
                tag: 'Universities & Clubs',
                img: REAL_PHOTOS.festival,
                emoji: '🏮',
                desc: 'Convocations, sports meets, Avurudu, and club nights all organised seamlessly.',
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className="group bg-white rounded-3xl overflow-hidden border border-[#FFEAE4] hover:border-[#FFB7A2] shadow-xs hover:shadow-xl hover:shadow-[#FF7654]/10 transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#FFEAE4]">
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#FFFDFB]/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-[#221513] flex items-center gap-1.5 shadow-xs">
                    <span>{card.emoji}</span>
                    <span>{card.tag}</span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-lg text-[#221513] mb-1.5 group-hover:text-[#FF7654] transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-[#6E554F] leading-relaxed">
                      {card.desc}
                    </p>
                  </div>

                  <Link
                    href="/auth?mode=signup"
                    className="mt-4 pt-3 border-t border-[#FFEAE4] flex items-center justify-between text-xs font-bold text-[#FF7654] hover:text-[#D43E19]"
                  >
                    <span>Create for this</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── HOW IT WORKS (3 Simple Steps) ─── */}
        <section id="how" className="py-20 bg-[#FFF6F3] border-y border-[#FFEAE4]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-xl mx-auto mb-16">
              <span className="text-xs font-bold tracking-wider uppercase text-[#D43E19] bg-[#FFEAE4] px-3.5 py-1 rounded-full">
                Effortless flow
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#221513] mt-3 tracking-tight">
                How Pixlane works in 30 seconds
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  title: 'Create Your Event',
                  desc: 'Give your trip or party a name. We instantly create a unique QR code and private link.',
                  icon: <Camera className="w-6 h-6 text-white" />,
                },
                {
                  step: '02',
                  title: 'Show QR to Friends',
                  desc: 'Display it on your phone or send the link. Friends tap and upload photos straight from their gallery.',
                  icon: <Share2 className="w-6 h-6 text-white" />,
                },
                {
                  step: '03',
                  title: 'Live Gallery & Downloads',
                  desc: 'All photos stream in real time. Download everything in full quality with one click anytime.',
                  icon: <Download className="w-6 h-6 text-white" />,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-7 border border-[#FFD5C8] shadow-xs relative flex flex-col items-start hover:-translate-y-1 transition-transform"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF7654] to-[#FFA387] flex items-center justify-center shadow-md shadow-[#FF7654]/20 mb-5">
                    {item.icon}
                  </div>
                  <span className="text-xs font-extrabold text-[#FF7654] tracking-widest uppercase mb-1">
                    Step {item.step}
                  </span>
                  <h3 className="text-xl font-extrabold text-[#221513] mb-2">{item.title}</h3>
                  <p className="text-sm text-[#6E554F] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── WHY NOT WHATSAPP COMPARISON ─── */}
        <section id="compare" className="py-20 max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-wider uppercase text-[#FF7654] bg-[#FFEAE4] px-3.5 py-1 rounded-full">
              The Real Difference
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#221513] mt-3 tracking-tight">
              Why not just use WhatsApp?
            </h2>
            <p className="text-sm text-[#6E554F] mt-2">
              WhatsApp was built for chatting, not for preserving your once-in-a-lifetime memories.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#FFEAE4] overflow-hidden shadow-sm">
            <div className="grid grid-cols-12 bg-[#FFF6F3] p-4 text-xs font-extrabold text-[#6E554F] border-b border-[#FFEAE4] uppercase tracking-wider">
              <div className="col-span-6 sm:col-span-6">Feature</div>
              <div className="col-span-3 sm:col-span-3 text-center text-[#D43E19]">Pixlane 📸</div>
              <div className="col-span-3 sm:col-span-3 text-center text-gray-500">WhatsApp 💬</div>
            </div>

            {[
              { f: 'Photo Quality', pix: '100% Original High-Res', wa: 'Compacts & reduces ~70%' },
              { f: 'Guest Access', pix: 'Scan QR in browser (No App)', wa: 'Need phone number in group' },
              { f: 'Storage & Gallery', pix: 'Neat live event gallery', wa: 'Lost in endless chat texts' },
              { f: 'Download All', pix: '1-Click ZIP Archive', wa: 'Click save on every single photo' },
              { f: 'Privacy', pix: 'Host controls permissions', wa: 'Anyone sees everyone’s numbers' },
            ].map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-12 p-4 text-xs sm:text-sm items-center border-b border-[#FFEAE4] last:border-0 ${
                  i % 2 === 0 ? 'bg-white' : 'bg-[#FFFDFB]'
                }`}
              >
                <div className="col-span-6 sm:col-span-6 font-bold text-[#221513]">{row.f}</div>
                <div className="col-span-3 sm:col-span-3 text-center font-bold text-[#D43E19] flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-[#FF7654] shrink-0" />
                  <span className="hidden sm:inline">{row.pix}</span>
                </div>
                <div className="col-span-3 sm:col-span-3 text-center text-[#6E554F] text-xs">
                  {row.wa}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── BOTTOM CTA BANNER ─── */}
        <section className="py-16 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-[#FF7654] via-[#F45732] to-[#D43E19] rounded-[2.5rem] p-8 sm:p-14 text-white text-center relative overflow-hidden shadow-xl shadow-[#FF7654]/25">
            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
              <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3.5 py-1 rounded-full backdrop-blur-xs mb-4">
                Ready for your next adventure?
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4">
                Capture every angle of your memories today.
              </h2>
              <p className="text-white/85 text-sm sm:text-base mb-8 max-w-lg">
                Create your first event album in 15 seconds. It’s free, instant, and everyone in your gang will love it.
              </p>

              <Link
                href="/auth?mode=signup"
                className="inline-flex items-center gap-2 bg-white text-[#D43E19] hover:bg-[#FFF6F3] font-extrabold text-base px-8 py-4 rounded-2xl shadow-lg hover:scale-105 transition-all"
              >
                <span>Get Started — It&apos;s Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ─── ELEGANT PEACH FOOTER ─── */}
      <footer className="border-t border-[#FFEAE4] bg-[#FFF6F3] py-12 text-[#6E554F]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#FF7654] flex items-center justify-center text-white">
              <Camera className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base text-[#221513]">Pixlane</span>
            <span className="text-xs text-[#6E554F] ml-2">© {new Date().getFullYear()}</span>
          </div>

          <div className="flex items-center gap-6 text-xs font-semibold">
            <Link href="#how" className="hover:text-[#FF7654] transition-colors">How it works</Link>
            <Link href="#occasions" className="hover:text-[#FF7654] transition-colors">Occasions</Link>
            <Link href="/auth" className="hover:text-[#FF7654] transition-colors">Host Login</Link>
          </div>

          <p className="text-xs text-[#6E554F] flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-[#FF7654] fill-current" /> in Sri Lanka 🇱🇰
          </p>
        </div>
      </footer>
    </div>
  )
}

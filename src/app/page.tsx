import Link from 'next/link'
import Logo from '@/components/Logo'
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
  Video,
  Check,
  Crown,
  ShieldCheck,
  MessageCircle,
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 min-h-16 sm:h-20 py-2.5 flex items-center justify-between">
          <Logo size="responsive" priority href="/" />

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-[#6E554F]">
            <Link href="#how" className="hover:text-[#FF7654] transition-colors">How it works</Link>
            <Link href="#occasions" className="hover:text-[#FF7654] transition-colors">Occasions</Link>
            <Link href="#compare" className="hover:text-[#FF7654] transition-colors">vs WhatsApp</Link>
            <Link href="#pricing" className="hover:text-[#FF7654] transition-colors">Pricing</Link>
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
                  <span>The New Way to Share Event Photos & Videos 🇱🇰</span>
                </div>

                <h1 className="font-cinzel text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#221513] leading-[1.2] mb-5">
                  Stop losing memories to{' '}
                  <span className="relative whitespace-nowrap">
                    <span className="peach-gradient-text">blurry chats.</span>
                    <svg className="absolute -bottom-2 left-0 w-full text-[#FF7654]/40 h-2.5" viewBox="0 0 100 12" preserveAspectRatio="none">
                      <path d="M0,8 Q50,0 100,8" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-[#6E554F] leading-relaxed mb-8 max-w-xl">
                  One QR code. Everyone scans, snaps, and drops their <strong className="text-[#221513] font-bold">photos and video clips</strong> in one live shared gallery. 
                  Zero app download. Original 100% resolution.
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
                    href="#pricing"
                    className="flex items-center justify-center gap-2 bg-[#FFF6F3] hover:bg-[#FFEAE4] text-[#6E554F] hover:text-[#221513] font-bold text-base px-6 py-3.5 rounded-2xl border border-[#FFD5C8] transition-colors text-center"
                  >
                    <Crown className="w-4 h-4 text-[#FF7654]" />
                    <span>View Event Passes</span>
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
                    <span className="font-extrabold text-[#221513]">3,400+ memories</span> gathered this week
                  </div>
                  <div className="flex items-center gap-1 text-[#FF7654]">
                    <Sparkles className="w-4 h-4 fill-current" />
                    <span className="font-bold">Free forever for casual hangouts</span>
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
                        <span className="text-xs font-bold text-[#6E554F]">142 photos &bull; 8 vids</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-[#FF7654] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs">
                        <Camera className="w-3.5 h-3.5" />
                        <span>Add Media</span>
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
                    <p className="text-[11px] text-[#6E554F]">Photos & videos supported</p>
                  </div>
                </div>

                <div className="absolute -bottom-4 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md border border-[#FFD5C8] rounded-2xl p-3 shadow-lg flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FFF6F3] text-[#FF7654] flex items-center justify-center">
                    <Heart className="w-5 h-5 fill-[#FF7654]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#221513]">Zero compression</p>
                    <p className="text-[11px] text-[#6E554F]">Original 4K / HD quality</p>
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
                  <h3 className="font-extrabold text-base text-[#221513]">Photos & Videos Live</h3>
                  <p className="text-xs text-[#6E554F] mt-0.5">Stream both full-res photos and funny video clips from everyone.</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-[#FFD5C8] shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-[#FFEAE4] text-[#D43E19] flex items-center justify-center shrink-0">
                  <Download className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#221513]">1-Click ZIP Download</h3>
                  <p className="text-xs text-[#6E554F] mt-0.5">Download every picture and video in high-res with one tap, or save individually.</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-[#FFD5C8] shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-[#FFEAE4] text-[#D43E19] flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#221513]">Animated Theme Templates</h3>
                  <p className="text-xs text-[#6E554F] mt-0.5">Dynamic animated backgrounds tailored for beach trips, weddings, and parties.</p>
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
            <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-bold text-[#221513] mt-3 tracking-wide">
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
                desc: 'Capture everyone’s selfies, candid moments, landscape views, and road trip clips.',
              },
              {
                title: 'Weddings & Poruwa',
                tag: 'Big Celebrations',
                img: REAL_PHOTOS.wedding,
                emoji: '💍',
                desc: 'Print table QR cards. Guests upload their candid shots and dance clips while the photographer works.',
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
              <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-bold text-[#221513] mt-3 tracking-wide">
                How Pixlane works in 30 seconds
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  title: 'Create Your Event',
                  desc: 'Pick your animated theme template. We instantly create a unique QR code and private link.',
                  icon: <Camera className="w-6 h-6 text-white" />,
                },
                {
                  step: '02',
                  title: 'Show QR to Friends',
                  desc: 'Display it on your phone or print table cards. Friends tap and upload photos & videos without an app.',
                  icon: <Share2 className="w-6 h-6 text-white" />,
                },
                {
                  step: '03',
                  title: 'Live Gallery & Downloads',
                  desc: 'Watch the stream fill up in real time. Download everything in full quality with one click anytime.',
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
            <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-bold text-[#221513] mt-3 tracking-wide">
              Why not just use WhatsApp?
            </h2>
            <p className="text-sm text-[#6E554F] mt-2">
              WhatsApp crushes your photos and compresses videos into low-res clips.
            </p>
          </div>

          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <div className="min-w-[560px] bg-white rounded-3xl border border-[#FFEAE4] overflow-hidden shadow-sm">
              <div className="grid grid-cols-12 bg-[#FFF6F3] p-4 text-xs font-extrabold text-[#6E554F] border-b border-[#FFEAE4] uppercase tracking-wider">
                <div className="col-span-6 sm:col-span-6">Feature</div>
                <div className="col-span-3 sm:col-span-3 text-center text-[#D43E19]">Pixlane 📸</div>
                <div className="col-span-3 sm:col-span-3 text-center text-gray-500">WhatsApp 💬</div>
              </div>

              {[
                { f: 'Photo & Video Quality', pix: '100% Original High-Res', wa: 'Compacts & reduces ~70%' },
                { f: 'Guest Access', pix: 'Scan QR in browser (No App)', wa: 'Need phone number in group' },
                { f: 'Storage & Gallery', pix: 'Neat live event gallery', wa: 'Lost in endless chat texts' },
                { f: 'Download All', pix: '1-Click ZIP Archive', wa: 'Click save on every single photo' },
                { f: 'Animated Themes', pix: 'Dynamic custom backgrounds', wa: 'Plain static chat wallpaper' },
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
          </div>
        </section>

        {/* ─── PRICING PLANS SECTION ─── */}
        <section id="pricing" className="py-20 bg-[#FFF6F3] border-y border-[#FFEAE4]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-xl mx-auto mb-14">
              <span className="text-xs font-bold tracking-wider uppercase text-[#D43E19] bg-[#FFEAE4] px-3.5 py-1 rounded-full">
                Simple & Transparent
              </span>
              <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-bold text-[#221513] mt-3 tracking-wide">
                Event passes for every gathering
              </h2>
              <p className="text-sm text-[#6E554F] mt-2">
                Free forever for small hangouts. Upgrade only when you host big weddings or large batches.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Plan 1: Free */}
              <div className="bg-white rounded-3xl p-7 border border-[#FFEAE4] flex flex-col justify-between shadow-xs">
                <div>
                  <h3 className="font-extrabold text-xl text-[#221513]">Outing Free</h3>
                  <p className="text-xs text-[#6E554F] mt-1 mb-4">For casual trips & hangouts</p>
                  <div className="mb-6 pb-6 border-b border-[#FFEAE4]">
                    <span className="text-4xl font-black text-[#221513]">Rs. 0</span>
                    <span className="text-xs text-[#6E554F] block mt-1">free forever</span>
                  </div>
                  <ul className="space-y-3 text-xs text-[#6E554F] mb-8">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#FF7654]" />
                      <span>Up to 30 high-res photos</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#FF7654]" />
                      <span>Up to 3 short video clips</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#FF7654]" />
                      <span>30 days active gallery storage</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#FF7654]" />
                      <span>1-Click ZIP download</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/auth?mode=signup"
                  className="w-full py-3.5 rounded-2xl font-bold text-xs bg-[#FFF6F3] hover:bg-[#FFEAE4] text-[#D43E19] border border-[#FFD5C8] text-center transition-colors"
                >
                  Start Free
                </Link>
              </div>

              {/* Plan 2: Pro */}
              <div className="bg-white rounded-3xl p-7 border-2 border-[#FF7654] flex flex-col justify-between shadow-xl shadow-[#FF7654]/15 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FF7654] to-[#FFA387] text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-xs">
                  Most Popular
                </div>
                <div>
                  <h3 className="font-extrabold text-xl text-[#221513]">Party Pro</h3>
                  <p className="text-xs text-[#6E554F] mt-1 mb-4">For birthdays, batches & road trips</p>
                  <div className="mb-6 pb-6 border-b border-[#FFEAE4]">
                    <span className="text-4xl font-black text-[#221513]">Rs. 1,900</span>
                    <span className="text-xs text-[#6E554F] block mt-1">one-time pass per event</span>
                  </div>
                  <ul className="space-y-3 text-xs text-[#6E554F] mb-8">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#FF7654] stroke-[3]" />
                      <strong className="text-[#221513]">Up to 250 high-res photos</strong>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#FF7654] stroke-[3]" />
                      <strong className="text-[#221513]">Up to 15 HD video clips</strong>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#FF7654]" />
                      <span>90 days active gallery storage</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#FF7654]" />
                      <span>Animated theme backgrounds</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/auth?mode=signup"
                  className="w-full py-3.5 rounded-2xl font-bold text-xs bg-gradient-to-r from-[#FF7654] to-[#FFA387] hover:from-[#F45732] hover:to-[#FF8E72] text-white shadow-md text-center transition-all"
                >
                  Get Party Pass
                </Link>
              </div>

              {/* Plan 3: Wedding */}
              <div className="bg-white rounded-3xl p-7 border border-[#FFEAE4] flex flex-col justify-between shadow-xs">
                <div>
                  <h3 className="font-extrabold text-xl text-[#221513]">Wedding & Grand</h3>
                  <p className="text-xs text-[#6E554F] mt-1 mb-4">For weddings & grand gala nights</p>
                  <div className="mb-6 pb-6 border-b border-[#FFEAE4]">
                    <span className="text-4xl font-black text-[#221513]">Rs. 4,900</span>
                    <span className="text-xs text-[#6E554F] block mt-1">one-time pass per wedding</span>
                  </div>
                  <ul className="space-y-3 text-xs text-[#6E554F] mb-8">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#FF7654] stroke-[3]" />
                      <strong className="text-[#221513]">UNLIMITED High-Res Photos</strong>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#FF7654] stroke-[3]" />
                      <strong className="text-[#221513]">UNLIMITED HD Videos</strong>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#FF7654]" />
                      <span>1 Full Year Cloud Storage</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#FF7654]" />
                      <span>Printable Table QR Designs</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/auth?mode=signup"
                  className="w-full py-3.5 rounded-2xl font-bold text-xs bg-[#FFF6F3] hover:bg-[#FFEAE4] text-[#D43E19] border border-[#FFD5C8] text-center transition-colors"
                >
                  Get Wedding Pass
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── BOTTOM CTA BANNER ─── */}
        <section className="py-16 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-[#FF7654] via-[#F45732] to-[#D43E19] rounded-[2.5rem] p-8 sm:p-14 text-white text-center relative overflow-hidden shadow-xl shadow-[#FF7654]/25">
            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
              <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3.5 py-1 rounded-full backdrop-blur-xs mb-4">
                Ready for your next adventure?
              </span>
              <h2 className="font-cinzel text-2xl sm:text-4xl lg:text-5xl font-bold tracking-wide leading-tight mb-4">
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

      {/* ─── MODERN COMPREHENSIVE FOOTER ─── */}
      <footer className="border-t border-[#FFEAE4] bg-[#FFF6F3] pt-16 pb-12 text-[#6E554F]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-[#FFEAE4]">
            {/* Column 1 & 2: Brand Identity & Pitch */}
            <div className="lg:col-span-2 space-y-4">
              <Logo size="responsive" />
              <p className="text-sm text-[#6E554F] leading-relaxed max-w-sm">
                The modern event photo & video sharing platform for Sri Lanka. Everyone scans one QR code, uploads instantly in original resolution, and all memories stay alive in one shared album.
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D43E19] bg-[#FFEAE4] px-3 py-1 rounded-full border border-[#FFD5C8]/60">
                  <span>🇱🇰</span>
                  <span>Made for Sri Lankan Celebrations</span>
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                  <span>CBSL Approved PayHere</span>
                </span>
              </div>

              {/* Direct WhatsApp Concierge Button */}
              <div className="pt-2">
                <a
                  href="https://wa.me/94770000000?text=Hi%20Pixlane!%20I%20have%20a%20question%20about%20hosting%20an%20event."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#221513] bg-white hover:bg-[#FFEAE4] px-4 py-2.5 rounded-xl border border-[#FFD5C8] shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-green-600" />
                  <span>Host Concierge Support (WhatsApp)</span>
                </a>
              </div>
            </div>

            {/* Column 3: Navigation */}
            <div>
              <h4 className="font-cinzel font-bold text-sm text-[#221513] uppercase tracking-wider mb-4">
                Explore Pixlane
              </h4>
              <ul className="space-y-2.5 text-xs font-medium">
                <li>
                  <Link href="#how" className="hover:text-[#FF7654] transition-colors">How It Works</Link>
                </li>
                <li>
                  <Link href="#occasions" className="hover:text-[#FF7654] transition-colors">Occasion Themes</Link>
                </li>
                <li>
                  <Link href="#compare" className="hover:text-[#FF7654] transition-colors">Pixlane vs WhatsApp</Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-[#FF7654] transition-colors">Event Passes & Pricing</Link>
                </li>
                <li>
                  <Link href="/auth?mode=signup" className="hover:text-[#FF7654] transition-colors font-bold text-[#FF7654]">Create Free Event</Link>
                </li>
                <li>
                  <Link href="/auth" className="hover:text-[#FF7654] transition-colors">Host Login</Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Popular Event Types */}
            <div>
              <h4 className="font-cinzel font-bold text-sm text-[#221513] uppercase tracking-wider mb-4">
                Event Themes
              </h4>
              <ul className="space-y-2.5 text-xs font-medium">
                <li className="flex items-center gap-1.5">
                  <span>💍</span>
                  <span>Weddings & Poruwa</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span>🎂</span>
                  <span>Birthday Bashes</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span>🎉</span>
                  <span>DJ & Night Parties</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span>🌴</span>
                  <span>Beach & Road Trips</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span>🎓</span>
                  <span>Campus & Uni Batches</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span>🏮</span>
                  <span>Vesak & Festivals</span>
                </li>
              </ul>
            </div>

            {/* Column 5: Guarantees & Features */}
            <div>
              <h4 className="font-cinzel font-bold text-sm text-[#221513] uppercase tracking-wider mb-4">
                Why Hosts Love It
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#FF7654] shrink-0 mt-0.5" />
                  <span>100% Original Resolution</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#FF7654] shrink-0 mt-0.5" />
                  <span>HD Video Uploads (Up to 100MB)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#FF7654] shrink-0 mt-0.5" />
                  <span>Zero App Download for Guests</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#FF7654] shrink-0 mt-0.5" />
                  <span>1-Click Bulk ZIP Archive</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#FF7654] shrink-0 mt-0.5" />
                  <span>Host Privacy & Moderation</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar: Copyright, Policies & Payment Channels */}
          <div className="pt-8 border-t border-[#FFEAE4]/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            <p className="text-[#6E554F] text-center md:text-left">
              &copy; {new Date().getFullYear()} Pixlane. All rights reserved. Memories in Every Angle.
            </p>

            {/* Legal eCommerce Policies (Bank Review Requirements) */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-[#6E554F]">
              <Link href="/terms" className="hover:text-[#FF7654] transition-colors underline">Terms &amp; Conditions</Link>
              <span>&bull;</span>
              <Link href="/privacy" className="hover:text-[#FF7654] transition-colors underline">Privacy Policy</Link>
              <span>&bull;</span>
              <Link href="/refund-policy" className="hover:text-[#FF7654] transition-colors underline">Refund Policy</Link>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="font-mono text-[11px] bg-white px-2.5 py-1 rounded-md border border-[#FFD5C8] text-[#221513]">
                Visa &bull; MasterCard &bull; FriMi &bull; Genie &bull; eZ Cash
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

# 📸 Pixlane

> **Every angle. One place.**
> Event photo sharing built for Sri Lanka 🇱🇰

Pixlane lets you create an event, share a QR code, and collect everyone's photos in one live gallery — no app download, no account needed for guests.

---

## ✨ Features

- 🔗 **One link / QR code** — guests upload from any phone browser
- 📸 **No app required** for guests — just scan and upload
- 🖼️ **Live gallery** — photos appear in real-time as guests upload
- 🔐 **Host dashboard** — manage events, toggle uploads, view QR
- 📱 **PWA** — installable on Android & iOS home screens
- 🗑️ **Delete & moderate** — hosts can remove any photo
- 📦 **Original quality** — no compression like WhatsApp

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 + Tailwind CSS |
| Backend & DB | Supabase (PostgreSQL + Auth + Realtime) |
| Storage | Supabase Storage (→ Cloudflare R2 at scale) |
| Hosting | Cloudflare Pages |
| Payments | PayHere (Sri Lanka) — coming soon |

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/akindaperera17229-dev/Pixlane.git
cd Pixlane
npm install
```

### 2. Set up Supabase
1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → paste and run [`supabase/setup.sql`](./supabase/setup.sql)
3. Go to **Storage** → create a bucket named `photos` (set to **Public**)
4. Go to **Database → Replication** → enable the `photos` table

### 3. Configure environment variables
```bash
cp .env.example .env.local
```
Fill in your Supabase URL and anon key from **Settings → API**.

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── auth/page.tsx               # Sign in / Sign up
│   ├── dashboard/
│   │   ├── page.tsx                # Host dashboard
│   │   ├── create/page.tsx         # Create event
│   │   └── events/[id]/            # Event management + QR
│   └── e/[code]/
│       ├── page.tsx                # Guest upload (no login needed)
│       └── gallery/page.tsx        # Live photo gallery
├── lib/supabase/                   # Supabase client/server/middleware
├── types/database.ts               # TypeScript DB types
└── middleware.ts                   # Auth route protection
supabase/
└── setup.sql                       # Database schema + RLS policies
```

---

## 🌍 Deployment

### Cloudflare Pages (recommended — free)
1. Push to GitHub
2. Go to [Cloudflare Pages](https://pages.cloudflare.com) → Connect to GitHub
3. Set build command: `npm run build`
4. Set output directory: `.next`
5. Add environment variables from `.env.example`

---

## 📄 License

MIT © 2026 Pixlane — Made with ❤️ in Sri Lanka 🇱🇰

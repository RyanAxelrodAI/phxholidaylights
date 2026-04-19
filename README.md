# PHX Holiday Lights

A Next.js PWA for discovering and sharing holiday light displays around Phoenix, AZ.

## Features

- 🗺️ Interactive dark-themed map with all approved locations
- 🏠 Community submission form (with Google Places Autocomplete)
- 💬 Feedback on existing locations (still active, no longer active, notes)
- 🔑 Simple admin review queue at `/admin?key=YOUR_KEY`
- 📱 PWA — installable on Android and iOS from the browser

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Google Maps API

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a project and enable these APIs:
   - **Maps JavaScript API**
   - **Places API**
3. Create an API key and restrict it to your domain (+ `localhost` for dev)

### 3. Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Open the SQL Editor and run [`supabase/schema.sql`](supabase/schema.sql)
3. Copy your **Project URL**, **anon key**, and **service_role key** from  
   Settings → API

### 4. Environment variables

```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_SECRET_KEY=pick_a_long_random_string
```

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Pages

| Route | Description |
|---|---|
| `/` | Map with all approved locations |
| `/submit` | Submit a new location |
| `/admin?key=SECRET` | Review pending submissions & feedback |

---

## Deploy to Vercel

1. Push this repo to GitHub
2. Import into [vercel.com](https://vercel.com)
3. Add all environment variables from `.env.local` in the Vercel dashboard
4. Deploy — Vercel auto-deploys on every push to `main`

---

## PWA Icons

Add icons to `public/icons/`:
- `icon-192.png` — 192×192px
- `icon-512.png` — 512×512px  
- `apple-touch-icon.png` — 180×180px

Use any image editor or [realfavicongenerator.net](https://realfavicongenerator.net) to generate them.

---

## App Store (optional, later)

- **Android**: Package the PWA as a [Trusted Web Activity (TWA)](https://developer.chrome.com/docs/android/trusted-web-activity/) using [PWABuilder](https://www.pwabuilder.com) — free, no native code needed.
- **iOS App Store**: Requires a native wrapper (Capacitor or React Native WebView). $99/year Apple Developer account needed.

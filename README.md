# Base Pulse 🟦

A news aggregator for the Base network - compatible with Web, Farcaster Frame v2, and Base App.

## 🚀 Features

- **Ticker**: ETH price and top gainers/losers on Base
- **Highlights Slider**: Featured news from official sources (Base, Coinbase)
- **Live Feed**: Latest news from all projects - infinite scroll
- **Farcaster Integration**: Frame v2, share intents, notifications
- **Tip Feature**: Support the app with ETH via Farcaster or Coinbase Wallet
- **Auto-Update**: Data fetching every 10 minutes, cleanup after 48 hours

## 📦 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Database**: Vercel Postgres + Prisma
- **APIs**: Neynar (Farcaster), DEXScreener (Prices)
- **Wallet**: Farcaster Wallet, Coinbase Wallet

## 🛠️ Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

In Vercel Dashboard or `.env.local`:

```env
POSTGRES_PRISMA_URL="postgresql://..."
POSTGRES_URL_NON_POOLING="postgresql://..."
NEYNAR_API_KEY="your-neynar-api-key"
CRON_SECRET="your-secret-here"
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"
```

### 3. Database Setup

```bash
npm run db:push
npm run db:seed
```

### 4. Development

```bash
npm run dev
```

## 📁 Project Structure

```
base-pulse/
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # 15 project seed data
├── src/
│   ├── app/
│   │   ├── api/         # API routes
│   │   │   ├── ticker/  # Price data
│   │   │   ├── news/    # News feed
│   │   │   ├── cron/    # Automated tasks
│   │   │   └── webhook/ # Farcaster webhooks
│   │   ├── news/[id]/   # News detail page
│   │   └── page.tsx     # Main page
│   ├── components/
│   │   ├── Ticker.tsx   # Scrolling price bar
│   │   ├── TipButton.tsx# Tip/donation button
│   │   ├── HighlightsSlider.tsx
│   │   ├── NewsFeed.tsx
│   │   ├── NewsCard.tsx
│   │   ├── NewsDetail.tsx
│   │   └── ShareButton.tsx
│   └── lib/
│       ├── config.ts    # App configuration
│       ├── db.ts        # Prisma client
│       ├── dexscreener.ts
│       ├── neynar.ts
│       ├── rss-parser.ts
│       └── farcaster.ts
└── vercel.json          # Cron job config
```

## 🔄 Cron Jobs (Vercel)

- `/api/cron/fetch-data`: Fetch data every 10 minutes
- `/api/cron/cleanup`: Delete expired data (48+ hours) every hour

## 🚀 Deployment

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy!

## 📱 Farcaster Frame

The app is automatically Farcaster Frame v2 compatible:
- `/.well-known/farcaster.json` manifest
- Mini app notifications
- Share intents

## 💎 Tip Feature

Users can tip the app using:
- Farcaster Wallet (when in Frame)
- Coinbase Wallet (in browser)

Update the tip contract address in `src/lib/config.ts`.

## 📄 License

MIT

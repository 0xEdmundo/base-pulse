# Base Pulse 🟦

Base ağı için haber toplayıcı (News Aggregator) - Web, Farcaster Frame v2 ve Base App uyumlu.

## 🚀 Özellikler

- **Ticker**: ETH fiyatı ve Base'deki en çok kazandıran/kaybettiren tokenlar
- **Highlights Slider**: Resmi kaynaklardan (Base, Coinbase) öne çıkan haberler
- **Live Feed**: Tüm projelerden son haberler - sonsuz kaydırma
- **Farcaster Entegrasyonu**: Frame v2, paylaşım intent'leri, bildirimler
- **Otomatik Güncelleme**: Her 10 dakikada veri çekme, 48 saat sonra temizleme

## 📦 Teknoloji

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Database**: Vercel Postgres + Prisma
- **APIs**: Neynar (Farcaster), DEXScreener (Fiyatlar)

## 🛠️ Kurulum

### 1. Bağımlılıkları Yükle

```bash
npm install
```

### 2. Environment Variables

Vercel Dashboard'da veya `.env.local` dosyasında:

```env
POSTGRES_PRISMA_URL="postgresql://..."
POSTGRES_URL_NON_POOLING="postgresql://..."
NEYNAR_API_KEY="201DD486-79A0-4B6F-B0C2-E719646F3A33"
CRON_SECRET="your-secret-here"
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"
```

### 3. Veritabanı Kurulumu

```bash
npm run db:push
npm run db:seed
```

### 4. Geliştirme

```bash
npm run dev
```

## 📁 Proje Yapısı

```
base-pulse/
├── prisma/
│   ├── schema.prisma    # Veritabanı şeması
│   └── seed.ts          # 15 proje seed data
├── src/
│   ├── app/
│   │   ├── api/         # API routes
│   │   │   ├── ticker/  # Fiyat verileri
│   │   │   ├── news/    # Haber feed
│   │   │   ├── cron/    # Otomatik görevler
│   │   │   └── webhook/ # Farcaster webhooks
│   │   ├── news/[id]/   # Haber detay sayfası
│   │   └── page.tsx     # Ana sayfa
│   ├── components/
│   │   ├── Ticker.tsx   # Kayan fiyat bandı
│   │   ├── HighlightsSlider.tsx
│   │   ├── NewsFeed.tsx
│   │   ├── NewsCard.tsx
│   │   ├── NewsDetail.tsx
│   │   └── ShareButton.tsx
│   └── lib/
│       ├── db.ts        # Prisma client
│       ├── dexscreener.ts
│       ├── neynar.ts
│       ├── rss-parser.ts
│       └── farcaster.ts
└── vercel.json          # Cron job config
```

## 🔄 Cron Jobs (Vercel)

- `/api/cron/fetch-data`: Her 10 dakikada veri çekme
- `/api/cron/cleanup`: Her saatte 48+ saat eski verileri silme

## 🚀 Deployment

1. GitHub'a push
2. Vercel'e bağla
3. Environment variables ekle
4. Deploy!

## 📱 Farcaster Frame

Uygulama otomatik olarak Farcaster Frame v2 uyumludur:
- `/.well-known/farcaster.json` manifest
- Mini app bildirimleri
- Paylaşım intent'leri

## 📄 Lisans

MIT

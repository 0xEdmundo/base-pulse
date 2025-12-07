import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Base Pulse - Base Ağı Haber Toplayıcı',
  description: 'Base ekosisteminin nabzını tutun. Aerodrome, Farcaster, Zora ve daha fazlasından son haberler.',
  keywords: ['Base', 'Farcaster', 'DeFi', 'NFT', 'Crypto', 'Haberler', 'Aggregator'],
  authors: [{ name: 'Base Pulse' }],
  openGraph: {
    title: 'Base Pulse - Base Ağı Haber Toplayıcı',
    description: 'Base ekosisteminin nabzını tutun.',
    url: 'https://basepulse.vercel.app',
    siteName: 'Base Pulse',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Base Pulse',
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Base Pulse - Base Ağı Haber Toplayıcı',
    description: 'Base ekosisteminin nabzını tutun.',
    images: ['/og-image.png'],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://basepulse.vercel.app/og-image.png',
    'fc:frame:button:1': 'Base Pulse\'u Aç',
    'fc:frame:button:1:action': 'launch_frame',
    'fc:frame:button:1:target': 'https://basepulse.vercel.app',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0052FF',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}

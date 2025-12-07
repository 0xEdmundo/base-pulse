import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Farcaster Frame manifest
export async function GET() {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://basepulse.vercel.app';

    const manifest = {
        accountAssociation: {
            header: 'eyJmaWQiOjAsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwIn0',
            payload: 'eyJkb21haW4iOiJiYXNlcHVsc2UudmVyY2VsLmFwcCJ9',
            signature: 'MHgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAw',
        },
        frame: {
            version: '1',
            name: 'Base Pulse',
            iconUrl: `${appUrl}/icon.png`,
            splashImageUrl: `${appUrl}/splash.png`,
            splashBackgroundColor: '#0052FF',
            homeUrl: appUrl,
            webhookUrl: `${appUrl}/api/webhook`,
        },
    };

    return NextResponse.json(manifest, {
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=3600',
        },
    });
}

'use client';

import { generateShareText, getComposeUrl } from '@/lib/farcaster';

interface ShareButtonProps {
    title: string;
    newsId: string;
    appUrl: string;
}

export default function ShareButton({ title, newsId, appUrl }: ShareButtonProps) {
    const handleShare = () => {
        const newsUrl = `${appUrl}/news/${newsId}`;
        const shareText = generateShareText(title, newsUrl, 'basepulse');
        const composeUrl = getComposeUrl(shareText, newsUrl);

        window.open(composeUrl, '_blank');
    };

    return (
        <button className="action-btn share-btn" onClick={handleShare}>
            <span className="action-icon">🔁</span>
            <span className="action-label">Farcaster&apos;da Paylaş</span>
        </button>
    );
}

'use client';

import { NewsItem, getTimeAgo, ASSETS } from '@/types';
import Image from 'next/image';

interface NewsCardProps {
    news: NewsItem;
    onClick: () => void;
}

export default function NewsCard({ news, onClick }: NewsCardProps) {
    return (
        <article className="news-card" onClick={onClick}>
            {/* Project Logo */}
            <div className="news-card-logo">
                <Image
                    src={news.project.logoUrl || ASSETS.baseLogo}
                    alt={news.project.name}
                    width={40}
                    height={40}
                    className="logo-image"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = ASSETS.baseLogo;
                    }}
                />
            </div>

            {/* Content */}
            <div className="news-card-content">
                <div className="news-card-header">
                    <span className="news-card-project">{news.project.name}</span>
                    <span className="news-card-source">
                        {news.sourceType === 'FARCASTER' ? '🟣' : '📝'}
                    </span>
                    <span className="news-card-time">{getTimeAgo(new Date(news.createdAt))}</span>
                </div>
                <h3 className="news-card-title">{news.title}</h3>
                {news.content && (
                    <p className="news-card-summary">
                        {news.content.slice(0, 120)}
                        {news.content.length > 120 ? '...' : ''}
                    </p>
                )}
                <div className="news-card-footer">
                    <span className="news-card-category">{news.project.category}</span>
                    <span className="news-card-likes">❤️ {news.likes}</span>
                </div>
            </div>

            {/* Thumbnail (if available) */}
            {news.imageUrl && (
                <div className="news-card-thumbnail">
                    <Image
                        src={news.imageUrl}
                        alt=""
                        width={80}
                        height={80}
                        className="thumbnail-image"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                        }}
                    />
                </div>
            )}
        </article>
    );
}

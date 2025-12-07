'use client';

import { NewsItem, getTimeAgo, ASSETS } from '@/types';
import Image from 'next/image';
import ShareButton from './ShareButton';
import { useState } from 'react';

interface NewsDetailProps {
    news: NewsItem;
    onClose: () => void;
    appUrl?: string;
}

export default function NewsDetail({ news, onClose, appUrl = '' }: NewsDetailProps) {
    const [likes, setLikes] = useState(news.likes);
    const [isLiking, setIsLiking] = useState(false);
    const [hasLiked, setHasLiked] = useState(false);

    const handleLike = async () => {
        if (isLiking || hasLiked) return;

        setIsLiking(true);
        try {
            const res = await fetch(`/api/news/${news.id}/like`, { method: 'POST' });
            const json = await res.json();
            if (json.success) {
                setLikes(json.data.likes);
                setHasLiked(true);
            }
        } catch (error) {
            console.error('Error liking news:', error);
        } finally {
            setIsLiking(false);
        }
    };

    const handleVisitWebsite = () => {
        if (news.project.websiteUrl) {
            window.open(news.project.websiteUrl, '_blank');
        }
    };

    const handleViewSource = () => {
        if (news.originalLink) {
            window.open(news.originalLink, '_blank');
        }
    };

    return (
        <div className="news-detail-overlay" onClick={onClose}>
            <div className="news-detail-modal" onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button className="news-detail-close" onClick={onClose}>
                    ✕
                </button>

                {/* Image */}
                <div className="news-detail-image-wrapper">
                    <Image
                        src={news.imageUrl || news.project.logoUrl || ASSETS.fallbackNewsImage}
                        alt={news.title}
                        fill
                        className="news-detail-image"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = ASSETS.fallbackNewsImage;
                        }}
                    />
                    <div className="news-detail-image-overlay">
                        <div className="news-detail-badge">
                            <Image
                                src={news.project.logoUrl || ASSETS.baseLogo}
                                alt={news.project.name}
                                width={32}
                                height={32}
                                className="badge-logo"
                            />
                            <span>{news.project.name}</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="news-detail-content">
                    <div className="news-detail-meta">
                        <span className="meta-category">{news.project.category}</span>
                        <span className="meta-time">{getTimeAgo(new Date(news.createdAt))}</span>
                        <span className="meta-source">
                            {news.sourceType === 'FARCASTER' ? '🟣 Farcaster' : '📝 Blog'}
                        </span>
                    </div>

                    <h1 className="news-detail-title">{news.title}</h1>

                    {news.content && (
                        <div className="news-detail-text">
                            {news.content}
                        </div>
                    )}

                    {/* Source Link */}
                    {news.originalLink && (
                        <button className="news-detail-source" onClick={handleViewSource}>
                            <span className="source-icon">🔗</span>
                            <span>Kaynağı Görüntüle</span>
                            <span className="source-hint">
                                {news.sourceType === 'FARCASTER'
                                    ? `@${news.project.farcasterUsername}`
                                    : 'Blog'}
                            </span>
                        </button>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="news-detail-actions">
                    {/* Like Button */}
                    <button
                        className={`action-btn like-btn ${hasLiked ? 'liked' : ''}`}
                        onClick={handleLike}
                        disabled={isLiking || hasLiked}
                    >
                        <span className="action-icon">{hasLiked ? '❤️' : '🤍'}</span>
                        <span className="action-label">{likes}</span>
                    </button>

                    {/* Share Button */}
                    <ShareButton
                        title={news.title}
                        newsId={news.id}
                        appUrl={appUrl}
                    />

                    {/* Visit Website Button */}
                    {news.project.websiteUrl && (
                        <button className="action-btn website-btn" onClick={handleVisitWebsite}>
                            <span className="action-icon">🌐</span>
                            <span className="action-label">Siteyi Ziyaret Et</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

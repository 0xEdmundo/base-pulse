'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { NewsItem, getTimeAgo, ASSETS } from '@/types';
import Image from 'next/image';
import ShareButton from '@/components/ShareButton';

export default function NewsDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [news, setNews] = useState<NewsItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [likes, setLikes] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch(`/api/news/${params.id}`);
                const json = await res.json();
                if (json.success) {
                    setNews(json.data);
                    setLikes(json.data.likes);
                }
            } catch (error) {
                console.error('Error fetching news:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) {
            fetchNews();
        }
    }, [params.id]);

    const handleLike = async () => {
        if (hasLiked || !news) return;

        try {
            const res = await fetch(`/api/news/${news.id}/like`, { method: 'POST' });
            const json = await res.json();
            if (json.success) {
                setLikes(json.data.likes);
                setHasLiked(true);
            }
        } catch (error) {
            console.error('Error liking news:', error);
        }
    };

    const appUrl = typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_APP_URL || '';

    if (isLoading) {
        return (
            <div className="news-page-loading">
                <div className="loading-spinner"></div>
                <span>Loading...</span>
            </div>
        );
    }

    if (!news) {
        return (
            <div className="news-page-error">
                <span className="error-icon">😕</span>
                <h1>News Not Found</h1>
                <button onClick={() => router.push('/')}>Go to Home</button>
            </div>
        );
    }

    return (
        <main className="news-page">
            {/* Back Button */}
            <button className="back-button" onClick={() => router.back()}>
                ← Back
            </button>

            {/* Image */}
            <div className="news-page-image-wrapper">
                <Image
                    src={news.imageUrl || news.project.logoUrl || ASSETS.fallbackNewsImage}
                    alt={news.title}
                    fill
                    className="news-page-image"
                />
                <div className="news-page-image-overlay">
                    <div className="news-page-badge">
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
            <div className="news-page-content">
                <div className="news-page-meta">
                    <span className="meta-category">{news.project.category}</span>
                    <span className="meta-time">{getTimeAgo(new Date(news.createdAt))}</span>
                </div>

                <h1 className="news-page-title">{news.title}</h1>

                {news.content && (
                    <div className="news-page-text">{news.content}</div>
                )}

                {/* Actions */}
                <div className="news-page-actions">
                    <button
                        className={`action-btn like-btn ${hasLiked ? 'liked' : ''}`}
                        onClick={handleLike}
                        disabled={hasLiked}
                    >
                        <span>{hasLiked ? '❤️' : '🤍'}</span>
                        <span>{likes}</span>
                    </button>

                    <ShareButton
                        title={news.title}
                        newsId={news.id}
                        appUrl={appUrl}
                    />

                    {news.project.websiteUrl && (
                        <button
                            className="action-btn website-btn"
                            onClick={() => window.open(news.project.websiteUrl!, '_blank')}
                        >
                            <span>🌐</span>
                            <span>Visit Website</span>
                        </button>
                    )}
                </div>
            </div>
        </main>
    );
}

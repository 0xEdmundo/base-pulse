'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { NewsItem } from '@/types';
import NewsCard from './NewsCard';

interface NewsFeedProps {
    onSelectNews: (news: NewsItem) => void;
}

export default function NewsFeed({ onSelectNews }: NewsFeedProps) {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    const fetchNews = useCallback(async (pageNum: number, append: boolean = false) => {
        try {
            if (!append) setIsLoading(true);
            else setIsLoadingMore(true);

            const res = await fetch(`/api/news?page=${pageNum}&pageSize=20`);
            const json = await res.json();

            if (json.success) {
                if (append) {
                    setNews(prev => [...prev, ...json.data.items]);
                } else {
                    setNews(json.data.items);
                }
                setHasMore(json.data.hasMore);
            }
        } catch (error) {
            console.error('Error fetching news:', error);
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        fetchNews(1);
    }, [fetchNews]);

    // Infinite scroll
    useEffect(() => {
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
                    setPage(prev => {
                        const nextPage = prev + 1;
                        fetchNews(nextPage, true);
                        return nextPage;
                    });
                }
            },
            { threshold: 0.1 }
        );

        if (loadMoreRef.current) {
            observerRef.current.observe(loadMoreRef.current);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [hasMore, isLoadingMore, fetchNews]);

    if (isLoading) {
        return (
            <div className="news-feed">
                <div className="news-feed-header">
                    <h2>📡 Latest News</h2>
                </div>
                <div className="news-feed-loading">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="skeleton-news-card">
                            <div className="skeleton-logo"></div>
                            <div className="skeleton-content">
                                <div className="skeleton-line short"></div>
                                <div className="skeleton-line long"></div>
                                <div className="skeleton-line medium"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (news.length === 0) {
        return (
            <div className="news-feed">
                <div className="news-feed-header">
                    <h2>📡 Latest News</h2>
                </div>
                <div className="news-feed-empty">
                    <span className="empty-icon">📭</span>
                    <p>No news yet</p>
                    <span className="empty-hint">News updates every 10 minutes</span>
                </div>
            </div>
        );
    }

    return (
        <div className="news-feed">
            <div className="news-feed-header">
                <h2>📡 Latest News</h2>
                <span className="news-count">{news.length} items</span>
            </div>

            <div className="news-feed-list">
                {news.map((item) => (
                    <NewsCard
                        key={item.id}
                        news={item}
                        onClick={() => onSelectNews(item)}
                    />
                ))}
            </div>

            {/* Infinite scroll trigger */}
            <div ref={loadMoreRef} className="load-more-trigger">
                {isLoadingMore && (
                    <div className="loading-more">
                        <span className="loading-spinner"></span>
                        <span>Loading more...</span>
                    </div>
                )}
                {!hasMore && news.length > 0 && (
                    <div className="no-more">
                        <span>🎉 All news loaded</span>
                    </div>
                )}
            </div>
        </div>
    );
}

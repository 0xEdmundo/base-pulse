'use client';

import { useEffect, useState, useRef } from 'react';
import { NewsItem, getTimeAgo, ASSETS } from '@/types';
import Image from 'next/image';

interface HighlightsSliderProps {
    onSelectNews: (news: NewsItem) => void;
}

export default function HighlightsSlider({ onSelectNews }: HighlightsSliderProps) {
    const [highlights, setHighlights] = useState<NewsItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const sliderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchHighlights = async () => {
            try {
                const res = await fetch('/api/highlights');
                const json = await res.json();
                if (json.success) {
                    setHighlights(json.data);
                }
            } catch (error) {
                console.error('Error fetching highlights:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHighlights();
    }, []);

    const scrollToIndex = (index: number) => {
        if (sliderRef.current) {
            const cardWidth = sliderRef.current.offsetWidth;
            sliderRef.current.scrollTo({
                left: cardWidth * index,
                behavior: 'smooth',
            });
            setActiveIndex(index);
        }
    };

    const handleScroll = () => {
        if (sliderRef.current) {
            const cardWidth = sliderRef.current.offsetWidth;
            const newIndex = Math.round(sliderRef.current.scrollLeft / cardWidth);
            setActiveIndex(newIndex);
        }
    };

    if (isLoading) {
        return (
            <div className="highlights-container">
                <div className="highlights-loading">
                    <div className="skeleton-card"></div>
                </div>
            </div>
        );
    }

    if (highlights.length === 0) {
        return (
            <div className="highlights-container">
                <div className="highlights-empty">
                    <span className="highlights-empty-icon">📰</span>
                    <p>No featured news yet</p>
                </div>
            </div>
        );
    }

    return (
        <div className="highlights-container">
            <h2 className="highlights-title">
                <span className="highlights-icon">✨</span>
                Highlights
            </h2>

            <div
                ref={sliderRef}
                className="highlights-slider"
                onScroll={handleScroll}
            >
                {highlights.map((news, index) => (
                    <div
                        key={news.id}
                        className="highlight-card"
                        onClick={() => onSelectNews(news)}
                    >
                        <div className="highlight-image-wrapper">
                            <Image
                                src={news.imageUrl || news.project.logoUrl || ASSETS.fallbackNewsImage}
                                alt={news.title}
                                fill
                                className="highlight-image"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = ASSETS.fallbackNewsImage;
                                }}
                            />
                            <div className="highlight-overlay">
                                <div className="highlight-badge">
                                    <Image
                                        src={news.project.logoUrl || ASSETS.baseLogo}
                                        alt={news.project.name}
                                        width={24}
                                        height={24}
                                        className="highlight-badge-logo"
                                    />
                                    <span>{news.project.name}</span>
                                </div>
                            </div>
                        </div>
                        <div className="highlight-content">
                            <h3 className="highlight-title">{news.title}</h3>
                            <span className="highlight-time">{getTimeAgo(new Date(news.createdAt))}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Dots indicator */}
            <div className="highlights-dots">
                {highlights.map((_, index) => (
                    <button
                        key={index}
                        className={`dot ${index === activeIndex ? 'active' : ''}`}
                        onClick={() => scrollToIndex(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}

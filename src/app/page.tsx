'use client';

import { useEffect, useState, useCallback } from 'react';
import Ticker from '@/components/Ticker';
import HighlightsSlider from '@/components/HighlightsSlider';
import NewsFeed from '@/components/NewsFeed';
import NewsDetail from '@/components/NewsDetail';
import { NewsItem } from '@/types';
import { initializeFrame, addFrame, isInFrame } from '@/lib/farcaster';

export default function Home() {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isFrameContext, setIsFrameContext] = useState(false);
  const [showAddPrompt, setShowAddPrompt] = useState(false);

  useEffect(() => {
    const init = async () => {
      const inFrame = isInFrame();
      setIsFrameContext(inFrame);

      if (inFrame) {
        await initializeFrame();
        setShowAddPrompt(true);
      }
    };

    init();
  }, []);

  const handleAddFrame = async () => {
    const added = await addFrame();
    if (added) {
      setShowAddPrompt(false);
    }
  };

  const handleSelectNews = useCallback((news: NewsItem) => {
    setSelectedNews(news);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedNews(null);
  }, []);

  const appUrl = typeof window !== 'undefined'
    ? window.location.origin
    : process.env.NEXT_PUBLIC_APP_URL || '';

  return (
    <main className="main-container">
      {/* Add Frame Prompt */}
      {showAddPrompt && isFrameContext && (
        <div className="add-frame-prompt">
          <button onClick={handleAddFrame} className="add-frame-btn">
            <span>➕</span>
            <span>Base Pulse&apos;u Ekle</span>
          </button>
        </div>
      )}

      {/* Ticker */}
      <Ticker />

      {/* Highlights Slider */}
      <HighlightsSlider onSelectNews={handleSelectNews} />

      {/* News Feed */}
      <NewsFeed onSelectNews={handleSelectNews} />

      {/* News Detail Modal */}
      {selectedNews && (
        <NewsDetail
          news={selectedNews}
          onClose={handleCloseDetail}
          appUrl={appUrl}
        />
      )}
    </main>
  );
}

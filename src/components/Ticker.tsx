'use client';

import { useEffect, useState } from 'react';
import { formatPrice, formatPercentage, TickerData } from '@/types';
import TipButton from './TipButton';

export default function Ticker() {
    const [tickerData, setTickerData] = useState<TickerData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTicker = async () => {
            try {
                const res = await fetch('/api/ticker');
                const json = await res.json();
                if (json.success) {
                    setTickerData(json.data);
                }
            } catch (error) {
                console.error('Error fetching ticker:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTicker();
        // Refresh every minute
        const interval = setInterval(fetchTicker, 60000);
        return () => clearInterval(interval);
    }, []);

    if (isLoading) {
        return (
            <div className="ticker-container">
                <TipButton />
                <div className="ticker-loading">
                    <span className="ticker-dot"></span>
                    <span>Loading...</span>
                </div>
            </div>
        );
    }

    if (!tickerData) {
        return null;
    }

    const { eth, topGainer, topLoser } = tickerData;

    return (
        <div className="ticker-container">
            <TipButton />
            <div className="ticker-content">
                <div className="ticker-scroll">
                    {/* ETH Price */}
                    <span className="ticker-item">
                        <span className="ticker-label">ETH</span>
                        <span className={`ticker-value ${eth.change24h >= 0 ? 'positive' : 'negative'}`}>
                            {formatPrice(eth.price)}
                        </span>
                        <span className={`ticker-change ${eth.change24h >= 0 ? 'positive' : 'negative'}`}>
                            {formatPercentage(eth.change24h)}
                        </span>
                    </span>

                    <span className="ticker-divider">|</span>

                    {/* Top Gainer */}
                    <span className="ticker-item">
                        <span className="ticker-label">🚀 Top Gainer:</span>
                        <span className="ticker-symbol">{topGainer.symbol}</span>
                        <span className="ticker-value positive">{formatPrice(topGainer.price)}</span>
                        <span className="ticker-change positive">{formatPercentage(topGainer.change24h)}</span>
                    </span>

                    <span className="ticker-divider">|</span>

                    {/* Top Loser */}
                    <span className="ticker-item">
                        <span className="ticker-label">📉 Top Loser:</span>
                        <span className="ticker-symbol">{topLoser.symbol}</span>
                        <span className="ticker-value negative">{formatPrice(topLoser.price)}</span>
                        <span className="ticker-change negative">{formatPercentage(topLoser.change24h)}</span>
                    </span>

                    {/* Duplicate for seamless loop */}
                    <span className="ticker-divider">|</span>
                    <span className="ticker-item">
                        <span className="ticker-label">ETH</span>
                        <span className={`ticker-value ${eth.change24h >= 0 ? 'positive' : 'negative'}`}>
                            {formatPrice(eth.price)}
                        </span>
                        <span className={`ticker-change ${eth.change24h >= 0 ? 'positive' : 'negative'}`}>
                            {formatPercentage(eth.change24h)}
                        </span>
                    </span>
                </div>
            </div>
        </div>
    );
}

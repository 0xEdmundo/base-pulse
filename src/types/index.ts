import { Category, Priority, SourceType } from '@prisma/client';

// Re-export Prisma enums for convenience
export { Category, Priority, SourceType };

// Project types
export interface Project {
    id: string;
    name: string;
    farcasterUsername: string | null;
    farcasterFid: string | null;
    websiteUrl: string | null;
    logoUrl: string | null;
    rssUrl: string | null;
    category: Category;
    priority: Priority;
    createdAt: Date;
    updatedAt: Date;
}

// News feed types
export interface NewsItem {
    id: string;
    sourceProjectId: string;
    project: Project;
    title: string;
    content: string | null;
    imageUrl: string | null;
    originalLink: string | null;
    sourceType: SourceType;
    createdAt: Date;
    expiresAt: Date;
    likes: number;
}

// Ticker types
export interface TokenData {
    symbol: string;
    price: number;
    change24h: number;
}

export interface TickerData {
    eth: TokenData;
    topGainer: TokenData;
    topLoser: TokenData;
    updatedAt: string;
}

// API response types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}

// Farcaster context types
export interface FarcasterContext {
    user?: {
        fid: number;
        username?: string;
        displayName?: string;
        pfpUrl?: string;
    };
}

// Asset URLs (Fallbacks)
export const ASSETS = {
    baseLogo: 'https://raw.githubusercontent.com/base-org/brand-kit/master/logo/symbol/Base_Symbol_Blue.svg',
    ethIcon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
    usdcIcon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
    fallbackNewsImage: 'https://images.mirror-media.xyz/publication-images/Kg_8y408uC04r88f_5qQW.png',
} as const;

// Time utilities
export function getTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'şimdi';
    if (diffMins < 60) return `${diffMins}dk önce`;
    if (diffHours < 24) return `${diffHours}sa önce`;
    if (diffDays === 1) return 'dün';
    return `${diffDays} gün önce`;
}

export function formatPrice(price: number): string {
    if (price >= 1000) {
        return price.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
    }
    return price.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: price < 1 ? 6 : 2,
    });
}

export function formatPercentage(value: number): string {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
}

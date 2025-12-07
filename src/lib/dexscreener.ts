// Token Contract Addresses on Base
export const TOKEN_CONTRACTS = {
    WETH: '0x4200000000000000000000000000000000000006',
    USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    AERO: '0x940181a94A35A4569E4529A3CDfB74e38FD98631',
    DEGEN: '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed',
    BRETT: '0x532f27101965dd16442E59d406436946499b0389',
    TOSHI: '0xAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4',
} as const;

// Base Network Configuration
export const BASE_NETWORK = {
    name: 'Base Mainnet',
    chainId: 8453,
    currencySymbol: 'ETH',
    rpcUrl: 'https://mainnet.base.org',
    blockExplorer: 'https://basescan.org',
    bridge: 'https://bridge.base.org',
} as const;

// DEXScreener API endpoints
const DEXSCREENER_API = 'https://api.dexscreener.com/latest/dex';

export interface TokenData {
    symbol: string;
    price: number;
    change24h: number;
    liquidity?: number;
}

export interface TickerData {
    eth: TokenData;
    topGainer: TokenData;
    topLoser: TokenData;
    updatedAt: string;
}

// Fetch ETH price from DEXScreener
async function fetchEthPrice(): Promise<TokenData> {
    try {
        const response = await fetch(
            `${DEXSCREENER_API}/tokens/${TOKEN_CONTRACTS.WETH}`,
            { next: { revalidate: 60 } }
        );
        const data = await response.json();

        if (data.pairs && data.pairs.length > 0) {
            const pair = data.pairs[0];
            return {
                symbol: 'ETH',
                price: parseFloat(pair.priceUsd) || 0,
                change24h: parseFloat(pair.priceChange?.h24) || 0,
            };
        }
    } catch (error) {
        console.error('Error fetching ETH price:', error);
    }

    return { symbol: 'ETH', price: 0, change24h: 0 };
}

// Fetch top gainers and losers on Base
async function fetchTopMovers(): Promise<{ gainer: TokenData; loser: TokenData }> {
    try {
        // Fetch popular tokens on Base
        const tokens = [
            TOKEN_CONTRACTS.AERO,
            TOKEN_CONTRACTS.DEGEN,
            TOKEN_CONTRACTS.BRETT,
            TOKEN_CONTRACTS.TOSHI,
        ];

        const responses = await Promise.all(
            tokens.map(addr =>
                fetch(`${DEXSCREENER_API}/tokens/${addr}`, { next: { revalidate: 60 } })
                    .then(r => r.json())
                    .catch(() => null)
            )
        );

        const tokenData: TokenData[] = responses
            .filter(data => data?.pairs?.length > 0)
            .map(data => {
                const pair = data.pairs[0];
                return {
                    symbol: pair.baseToken?.symbol || 'UNKNOWN',
                    price: parseFloat(pair.priceUsd) || 0,
                    change24h: parseFloat(pair.priceChange?.h24) || 0,
                };
            });

        if (tokenData.length === 0) {
            return {
                gainer: { symbol: 'N/A', price: 0, change24h: 0 },
                loser: { symbol: 'N/A', price: 0, change24h: 0 },
            };
        }

        // Sort by 24h change
        const sorted = [...tokenData].sort((a, b) => b.change24h - a.change24h);

        return {
            gainer: sorted[0],
            loser: sorted[sorted.length - 1],
        };
    } catch (error) {
        console.error('Error fetching top movers:', error);
        return {
            gainer: { symbol: 'N/A', price: 0, change24h: 0 },
            loser: { symbol: 'N/A', price: 0, change24h: 0 },
        };
    }
}

// Main function to fetch all ticker data
export async function fetchTickerData(): Promise<TickerData> {
    const [eth, movers] = await Promise.all([
        fetchEthPrice(),
        fetchTopMovers(),
    ]);

    return {
        eth,
        topGainer: movers.gainer,
        topLoser: movers.loser,
        updatedAt: new Date().toISOString(),
    };
}

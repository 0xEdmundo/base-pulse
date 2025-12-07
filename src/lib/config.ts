// Base Pulse Configuration
// Update these values as needed

// Tip feature configuration
export const TIP_CONFIG = {
    // Contract address for receiving tips (update with your contract)
    contractAddress: '0x0000000000000000000000000000000000000000',

    // Preset tip amounts in ETH
    amounts: [
        { label: '☕ 0.001', value: '0.001' },
        { label: '🍕 0.005', value: '0.005' },
        { label: '🚀 0.01', value: '0.01' },
    ],
};

// App configuration
export const APP_CONFIG = {
    name: 'Base Pulse',
    description: 'Base ağı haber toplayıcı',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://basepulse.vercel.app',
    farcasterUsername: 'basepulse',
};

// News expiration (in hours)
export const NEWS_EXPIRATION_HOURS = 48;

// Cron job intervals
export const CRON_INTERVALS = {
    fetchData: 10, // minutes
    cleanup: 60, // minutes
};

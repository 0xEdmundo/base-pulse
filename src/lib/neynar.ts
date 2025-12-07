// Neynar API client for Farcaster data
// API Key will be provided via environment variable

const NEYNAR_API_URL = 'https://api.neynar.com/v2';

export interface FarcasterUser {
    fid: number;
    username: string;
    displayName: string;
    pfpUrl: string;
}

export interface FarcasterCast {
    hash: string;
    text: string;
    timestamp: string;
    author: FarcasterUser;
    embeds?: Array<{
        url?: string;
        metadata?: {
            image?: string;
        };
    }>;
}

// Get API key from environment
function getApiKey(): string {
    const apiKey = process.env.NEYNAR_API_KEY;
    if (!apiKey) {
        throw new Error('NEYNAR_API_KEY is not set');
    }
    return apiKey;
}

// Fetch user by username to get FID
export async function fetchUserByUsername(username: string): Promise<FarcasterUser | null> {
    try {
        const response = await fetch(
            `${NEYNAR_API_URL}/farcaster/user/by_username?username=${username}`,
            {
                headers: {
                    'accept': 'application/json',
                    'api_key': getApiKey(),
                },
            }
        );

        if (!response.ok) {
            console.error(`Failed to fetch user ${username}:`, response.statusText);
            return null;
        }

        const data = await response.json();
        if (data.user) {
            return {
                fid: data.user.fid,
                username: data.user.username,
                displayName: data.user.display_name,
                pfpUrl: data.user.pfp_url,
            };
        }

        return null;
    } catch (error) {
        console.error(`Error fetching user ${username}:`, error);
        return null;
    }
}

// Fetch recent casts from a user by FID
export async function fetchUserCasts(
    fid: string,
    limit: number = 10
): Promise<FarcasterCast[]> {
    try {
        const response = await fetch(
            `${NEYNAR_API_URL}/farcaster/feed/user/casts?fid=${fid}&limit=${limit}&include_replies=false`,
            {
                headers: {
                    'accept': 'application/json',
                    'api_key': getApiKey(),
                },
            }
        );

        if (!response.ok) {
            console.error(`Failed to fetch casts for FID ${fid}:`, response.statusText);
            return [];
        }

        const data = await response.json();

        if (!data.casts) return [];

        return data.casts.map((cast: any) => ({
            hash: cast.hash,
            text: cast.text,
            timestamp: cast.timestamp,
            author: {
                fid: cast.author.fid,
                username: cast.author.username,
                displayName: cast.author.display_name,
                pfpUrl: cast.author.pfp_url,
            },
            embeds: cast.embeds,
        }));
    } catch (error) {
        console.error(`Error fetching casts for FID ${fid}:`, error);
        return [];
    }
}

// Batch fetch FIDs for multiple usernames
export async function fetchFidsByUsernames(
    usernames: string[]
): Promise<Map<string, number>> {
    const fidMap = new Map<string, number>();

    try {
        const response = await fetch(
            `${NEYNAR_API_URL}/farcaster/user/bulk-by-username?usernames=${usernames.join(',')}`,
            {
                headers: {
                    'accept': 'application/json',
                    'api_key': getApiKey(),
                },
            }
        );

        if (!response.ok) {
            console.error('Failed to bulk fetch users:', response.statusText);
            return fidMap;
        }

        const data = await response.json();

        if (data.users) {
            for (const user of data.users) {
                fidMap.set(user.username, user.fid);
            }
        }
    } catch (error) {
        console.error('Error bulk fetching users:', error);
    }

    return fidMap;
}

// Extract image URL from cast embeds
export function extractImageFromCast(cast: FarcasterCast): string | null {
    if (!cast.embeds || cast.embeds.length === 0) return null;

    for (const embed of cast.embeds) {
        // Check for image URL
        if (embed.url && isImageUrl(embed.url)) {
            return embed.url;
        }
        // Check for embed metadata image
        if (embed.metadata?.image) {
            return embed.metadata.image;
        }
    }

    return null;
}

function isImageUrl(url: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const lowerUrl = url.toLowerCase();
    return imageExtensions.some(ext => lowerUrl.includes(ext));
}

// Generate Warpcast cast URL
export function getCastUrl(hash: string, username: string): string {
    return `https://warpcast.com/${username}/${hash.slice(0, 10)}`;
}

// Generate Farcaster share intent URL
export function getShareIntentUrl(text: string, embedUrl?: string): string {
    const encodedText = encodeURIComponent(text);
    let url = `https://warpcast.com/~/compose?text=${encodedText}`;

    if (embedUrl) {
        url += `&embeds[]=${encodeURIComponent(embedUrl)}`;
    }

    return url;
}

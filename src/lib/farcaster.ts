import sdk from '@farcaster/frame-sdk';

// Farcaster Frame SDK utilities

let isInitialized = false;

// Initialize the Frame SDK (call once on app mount)
export async function initializeFrame(): Promise<boolean> {
    if (isInitialized) return true;

    try {
        // Signal to the parent frame that the app is ready
        await sdk.actions.ready();
        isInitialized = true;
        return true;
    } catch (error) {
        console.error('Failed to initialize Farcaster Frame SDK:', error);
        return false;
    }
}

// Get the current user's context (if running in a frame)
export async function getFrameContext() {
    try {
        return await sdk.context;
    } catch (error) {
        console.error('Failed to get frame context:', error);
        return null;
    }
}

// Open an external URL
export async function openUrl(url: string): Promise<void> {
    try {
        await sdk.actions.openUrl(url);
    } catch (error) {
        // Fallback to regular window.open if not in frame
        window.open(url, '_blank');
    }
}

// Request to add the frame
export async function addFrame(): Promise<boolean> {
    try {
        const result = await sdk.actions.addFrame();
        // Handle different SDK versions
        if (result && typeof result === 'object' && 'added' in result) {
            return Boolean(result.added);
        }
        return true; // Assume success if no added property
    } catch (error) {
        console.error('Failed to add frame:', error);
        return false;
    }
}

// Share to Farcaster using compose intent
export function getComposeUrl(text: string, embedUrl?: string): string {
    const encodedText = encodeURIComponent(text);
    let url = `https://warpcast.com/~/compose?text=${encodedText}`;

    if (embedUrl) {
        url += `&embeds[]=${encodeURIComponent(embedUrl)}`;
    }

    return url;
}

// Generate share text for news item
export function generateShareText(
    title: string,
    appUrl: string,
    appUsername: string = 'basepulse'
): string {
    // Truncate title if too long
    const maxTitleLength = 200;
    const truncatedTitle = title.length > maxTitleLength
        ? title.slice(0, maxTitleLength) + '...'
        : title;

    return `${truncatedTitle}\n\nDetaylar Base Pulse'da! 🔥\nvia @${appUsername}\n${appUrl}`;
}

// Check if running inside a Farcaster frame
export function isInFrame(): boolean {
    if (typeof window === 'undefined') return false;

    try {
        return window.self !== window.top;
    } catch {
        return true; // If access is denied, we're likely in an iframe
    }
}

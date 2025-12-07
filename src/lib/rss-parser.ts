import Parser from 'rss-parser';

const parser = new Parser({
    customFields: {
        item: [
            ['media:content', 'media'],
            ['media:thumbnail', 'thumbnail'],
            ['enclosure', 'enclosure'],
        ],
    },
});

export interface RSSItem {
    title: string;
    content: string;
    link: string;
    imageUrl: string | null;
    pubDate: Date;
}

// Extract image from RSS item
function extractImage(item: any): string | null {
    // Try media:content
    if (item.media?.['$']?.url) {
        return item.media['$'].url;
    }

    // Try media:thumbnail
    if (item.thumbnail?.['$']?.url) {
        return item.thumbnail['$'].url;
    }

    // Try enclosure
    if (item.enclosure?.url && item.enclosure.type?.startsWith('image/')) {
        return item.enclosure.url;
    }

    // Try to extract from content
    if (item.content) {
        const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch) {
            return imgMatch[1];
        }
    }

    // Try to extract from content:encoded
    if (item['content:encoded']) {
        const imgMatch = item['content:encoded'].match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch) {
            return imgMatch[1];
        }
    }

    return null;
}

// Clean HTML from content
function cleanContent(html: string): string {
    if (!html) return '';

    return html
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/&nbsp;/g, ' ') // Replace &nbsp;
        .replace(/&amp;/g, '&') // Replace &amp;
        .replace(/&lt;/g, '<') // Replace &lt;
        .replace(/&gt;/g, '>') // Replace &gt;
        .replace(/&quot;/g, '"') // Replace &quot;
        .replace(/&#39;/g, "'") // Replace &#39;
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim()
        .slice(0, 500); // Limit content length
}

// Fetch and parse RSS feed
export async function fetchRSSFeed(url: string): Promise<RSSItem[]> {
    try {
        const feed = await parser.parseURL(url);

        return feed.items.map(item => ({
            title: item.title || 'Untitled',
            content: cleanContent(item.contentSnippet || item.content || item.summary || ''),
            link: item.link || '',
            imageUrl: extractImage(item),
            pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
        }));
    } catch (error) {
        console.error(`Error fetching RSS feed ${url}:`, error);
        return [];
    }
}

// Check if RSS item is recent (within last hour for cron job)
export function isRecentItem(pubDate: Date, hoursAgo: number = 1): boolean {
    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - hoursAgo);
    return pubDate > cutoff;
}

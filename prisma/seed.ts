import { PrismaClient, Category, Priority } from '@prisma/client';

const prisma = new PrismaClient();

const projects = [
    {
        name: "Base Official",
        farcasterUsername: "base",
        websiteUrl: "https://base.org",
        logoUrl: "https://raw.githubusercontent.com/base-org/brand-kit/master/logo/symbol/Base_Symbol_Blue.svg",
        category: Category.OFFICIAL,
        priority: Priority.CRITICAL,
    },
    {
        name: "Jesse Pollak",
        farcasterUsername: "jessepollak",
        websiteUrl: "https://base.org/jobs",
        logoUrl: "https://raw.githubusercontent.com/base-org/brand-kit/master/logo/symbol/Base_Symbol_Blue.svg",
        category: Category.OFFICIAL,
        priority: Priority.HIGH,
    },
    {
        name: "Coinbase Wallet",
        farcasterUsername: "coinbasewallet",
        websiteUrl: "https://www.coinbase.com/wallet",
        logoUrl: "https://avatars.githubusercontent.com/u/18060234?s=200&v=4",
        category: Category.OFFICIAL,
        priority: Priority.HIGH,
    },
    {
        name: "Aerodrome",
        farcasterUsername: "aerodrome",
        websiteUrl: "https://aerodrome.finance",
        logoUrl: "https://aerodrome.finance/aerodrome.svg",
        category: Category.DEFI,
        priority: Priority.HIGH,
    },
    {
        name: "Farcaster",
        farcasterUsername: "farcaster",
        websiteUrl: "https://farcaster.xyz",
        logoUrl: "https://warpcast.com/og-logo.png",
        category: Category.SOCIAL,
        priority: Priority.HIGH,
    },
    {
        name: "Zora",
        farcasterUsername: "zora",
        websiteUrl: "https://zora.co",
        logoUrl: "https://zora.co/assets/og-image.png",
        category: Category.NFT,
        priority: Priority.NORMAL,
    },
    {
        name: "Degen",
        farcasterUsername: "degen",
        websiteUrl: "https://degen.tips",
        logoUrl: "https://degen.tips/logo.png",
        category: Category.MEME,
        priority: Priority.NORMAL,
    },
    {
        name: "Blackbird",
        farcasterUsername: "blackbird",
        websiteUrl: "https://www.blackbird.xyz",
        logoUrl: "https://www.blackbird.xyz/logo.png",
        category: Category.LIFESTYLE,
        priority: Priority.NORMAL,
    },
    {
        name: "Seamless",
        farcasterUsername: "seamless",
        websiteUrl: "https://seamlessprotocol.com",
        logoUrl: "https://seamlessprotocol.com/logo.svg",
        category: Category.DEFI,
        priority: Priority.NORMAL,
    },
    {
        name: "Friend.tech",
        farcasterUsername: "friendtech",
        websiteUrl: "https://friend.tech",
        logoUrl: "https://friend.tech/favicon.ico",
        category: Category.SOCIALFI,
        priority: Priority.NORMAL,
    },
    {
        name: "Moonwell",
        farcasterUsername: "moonwell",
        websiteUrl: "https://moonwell.fi",
        logoUrl: "https://moonwell.fi/logo.svg",
        category: Category.DEFI,
        priority: Priority.LOW,
    },
    {
        name: "Paragraph",
        farcasterUsername: "paragraph",
        websiteUrl: "https://paragraph.xyz",
        logoUrl: "https://paragraph.xyz/logo.png",
        category: Category.CONTENT,
        priority: Priority.LOW,
    },
    {
        name: "Brian Armstrong",
        farcasterUsername: "brian",
        websiteUrl: "https://coinbase.com",
        logoUrl: "https://avatars.githubusercontent.com/u/18060234?s=200&v=4",
        category: Category.INFLUENCER,
        priority: Priority.HIGH,
    },
    {
        name: "Rainbow Wallet",
        farcasterUsername: "rainbow",
        websiteUrl: "https://rainbow.me",
        logoUrl: "https://rainbow.me/favicon.ico",
        category: Category.WALLET,
        priority: Priority.LOW,
    },
    {
        name: "Synthetix",
        farcasterUsername: "synthetix",
        websiteUrl: "https://synthetix.io",
        logoUrl: "https://synthetix.io/logo.svg",
        category: Category.DEFI,
        priority: Priority.LOW,
    },
];

async function main() {
    console.log('🌱 Seeding database...');

    // Clear existing data
    await prisma.newsFeed.deleteMany();
    await prisma.project.deleteMany();

    // Insert projects
    for (const project of projects) {
        await prisma.project.create({
            data: project,
        });
        console.log(`✅ Created project: ${project.name}`);
    }

    // Initialize ticker cache
    await prisma.tickerCache.upsert({
        where: { id: 'ticker' },
        update: {},
        create: {
            id: 'ticker',
            data: {
                eth: { price: 0, change24h: 0 },
                topGainer: { symbol: 'LOADING', price: 0, change24h: 0 },
                topLoser: { symbol: 'LOADING', price: 0, change24h: 0 },
                updatedAt: new Date().toISOString(),
            },
        },
    });

    console.log('🎉 Seeding complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

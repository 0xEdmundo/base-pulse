import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Webhook endpoint for Farcaster notifications
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        console.log('Webhook received:', JSON.stringify(body, null, 2));

        // Handle different webhook events
        switch (body.type) {
            case 'frame_added':
                // User added the frame
                console.log(`User FID ${body.fid} added the frame`);
                // TODO: Store user FID for notifications
                break;

            case 'frame_removed':
                // User removed the frame
                console.log(`User FID ${body.fid} removed the frame`);
                // TODO: Remove user from notifications
                break;

            case 'notifications_enabled':
                // User enabled notifications
                console.log(`User FID ${body.fid} enabled notifications`);
                break;

            case 'notifications_disabled':
                // User disabled notifications
                console.log(`User FID ${body.fid} disabled notifications`);
                break;

            default:
                console.log('Unknown webhook type:', body.type);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { success: false, error: 'Webhook processing failed' },
            { status: 500 }
        );
    }
}

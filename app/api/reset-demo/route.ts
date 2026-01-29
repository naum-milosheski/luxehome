import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

/**
 * POST /api/reset-demo
 * 
 * Manually triggers the demo database reset.
 * Protected by DEMO_RESET_SECRET environment variable.
 * 
 * Usage:
 * curl -X POST https://your-domain.com/api/reset-demo \
 *   -H "Content-Type: application/json" \
 *   -d '{"secret": "your-secret-here"}'
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { secret } = body;

        // Validate secret
        const expectedSecret = process.env.DEMO_RESET_SECRET;

        if (!expectedSecret) {
            console.error('DEMO_RESET_SECRET not configured');
            return NextResponse.json(
                { success: false, error: 'Reset not configured' },
                { status: 500 }
            );
        }

        if (secret !== expectedSecret) {
            return NextResponse.json(
                { success: false, error: 'Invalid secret' },
                { status: 401 }
            );
        }

        // Execute reset function using admin client (bypasses RLS)
        const supabase = createAdminClient();

        const { error } = await supabase.rpc('reset_demo_data');

        if (error) {
            console.error('Reset failed:', error);
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Demo data reset successfully',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Reset API error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Also support GET for easy testing (still requires secret as query param)
export async function GET(request: NextRequest) {
    const secret = request.nextUrl.searchParams.get('secret');

    if (!secret) {
        return NextResponse.json(
            { success: false, error: 'Secret required' },
            { status: 400 }
        );
    }

    // Delegate to POST handler
    const mockRequest = {
        json: async () => ({ secret })
    } as NextRequest;

    return POST(mockRequest);
}

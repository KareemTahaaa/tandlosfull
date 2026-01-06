import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { password } = await request.json();
        const correctPassword = process.env.ADMIN_PASSWORD;

        if (!correctPassword) {
            console.error('ADMIN_PASSWORD is not set in environment variables');
            return NextResponse.json({ success: false, error: 'Server configuration error' }, { status: 500 });
        }

        if (password === correctPassword) {
            // Create response with success
            const response = NextResponse.json({ success: true });

            // Set a secure HTTP-only cookie
            response.cookies.set('admin_session', 'true', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: 60 * 60 * 24 * 7 // 1 week
            });

            return response;
        } else {
            return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ success: false, error: 'An error occurred' }, { status: 500 });
    }
}

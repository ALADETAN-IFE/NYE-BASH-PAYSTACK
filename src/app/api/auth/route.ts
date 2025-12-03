import { NextRequest, NextResponse } from 'next/server';
import { setAuthCookie, createToken } from '@/lib/jwt';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        const { username, password } = body ?? {};

        if (!username || !password) {
            return NextResponse.json(
                { error: 'username and password required' },
                { status: 400 }
            );
        }

        const isValid =
            username === process.env.USER_LOGIN && password === process.env.USER_PASSWORD;

        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const token = await createToken(username);
        await setAuthCookie(token)

        const response = NextResponse.json(
            { success: true, message: 'Login Successful' },
            { status: 200 }
        );        
        return response;
    } catch {
        return NextResponse.json(
            { error: 'Server error' },
            { status: 500 }
        );
    }
}
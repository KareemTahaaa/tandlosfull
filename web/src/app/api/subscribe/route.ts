
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

// Configure Nodemailer Transporter
// NOTE: User must provide EMAIL_USER (e.g. gmail) and EMAIL_PASS (app password) in .env
const transporter = nodemailer.createTransport({
    service: 'gmail', // Or use 'host', 'port' if not gmail
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }

        // Check if already subscribed
        const existing = await prisma.subscriber.findUnique({
            where: { email },
        });

        if (existing) {
            return NextResponse.json({ message: 'You are already on the list!' }, { status: 200 });
        }

        // Save to Database
        await prisma.subscriber.create({
            data: { email },
        });

        // Get total count for ranking (Start from 500)
        const count = await prisma.subscriber.count();
        const rank = count + 500;

        // Send Confirmation Email
        try {
            // Validate Env Vars
            if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
                throw new Error('Server misconfiguration: EMAIL_USER or EMAIL_PASS missing');
            }

            // Construct absolute URL for the image attachment (more reliable in serverless than FS)
            const origin = request.headers.get('origin') || 'https://tandlos.vercel.app';
            const imageUrl = `${origin}/promo-code.jpg`;

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'You’re Early. You’re Inside. Take Your Reward.',
                html: `
                    <div style="font-family: Arial, sans-serif; color: #000; max-width: 600px; margin: 0 auto;">
                        <p>Hey,</p>
                        <p>Thank you for being one of the first to join the TANDLOS waitlist — you’re officially part of the <strong>FIRST 1000</strong>.</p>
                        <p>You are member <strong>#${rank}</strong>.</p>
                        <p>That means you’re not just early… you’re special.</p>
                        <br />
                        <p>To show our appreciation, here’s your exclusive promo code — just for you.</p>
                        <p>Use it on launch day and unlock your reward.</p>
                        <br />
                        <div style="text-align: center; padding: 20px; border: 2px dashed #000; display: inline-block;">
                            <h2 style="margin: 0; letter-spacing: 2px;">FIRST1000</h2>
                        </div>
                        <br />
                        <br />
                        <p>(also attached as an image, save it somewhere safe)</p>
                        <br />
                        <p>Stay tuned — something different is coming.</p>
                        <p>— TANDLOS</p>
                    </div>
                `,
                attachments: [
                    {
                        filename: 'promo-code.jpg',
                        path: imageUrl, // Use URL instead of local path
                        cid: 'promocode'
                    }
                ]
            });
        } catch (emailError: any) {
            console.error('Failed to send email:', emailError);
            // Return this error to the user so we can debug
            return NextResponse.json({
                message: 'Subscribed, but email failed.',
                debugError: emailError.message || String(emailError)
            }, { status: 201 });
        }

        return NextResponse.json({ message: 'Successfully subscribed! Check your email.' }, { status: 201 });
    } catch (error: any) {
        console.error('Subscription error:', error);
        return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
    }
}

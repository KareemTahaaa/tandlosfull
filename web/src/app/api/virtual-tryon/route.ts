import { NextRequest, NextResponse } from 'next/server';

// Use Hugging Face Space with Gradio API - completely free!
const HF_SPACE_URL = 'https://yisol-idm-vton.hf.space';

export async function POST(request: NextRequest) {
    try {
        const { userImage, garmentImage } = await request.json();

        if (!userImage || !garmentImage) {
            return NextResponse.json(
                { error: 'Missing required images' },
                { status: 400 }
            );
        }

        console.log('Starting virtual try-on with Gradio API...');

        // Convert garment image to absolute URL if it's relative
        let garmentUrl = garmentImage;
        if (garmentImage.startsWith('/')) {
            const origin = request.headers.get('origin') || 'http://localhost:3000';
            garmentUrl = `${origin}${garmentImage}`;
        }

        // Use Gradio API endpoint
        const gradioApiUrl = `${HF_SPACE_URL}/api/predict`;

        const payload = {
            data: [
                userImage,      // Human image (base64)
                garmentUrl,     // Garment image (URL)
                "Garment description", // Description
                true,           // is_checked
                true,           // is_checked_crop
                0,              // denoise_steps
                42              // seed
            ]
        };

        console.log('Sending request to Gradio API...');

        const response = await fetch(gradioApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gradio API error:', errorText);

            return NextResponse.json(
                { error: 'Virtual try-on service is temporarily unavailable. Please try again in a moment.' },
                { status: 503 }
            );
        }

        const result = await response.json();
        console.log('Gradio API response:', result);

        // Gradio returns the result image in data array
        if (result.data && result.data[0]) {
            const resultImage = result.data[0];
            return NextResponse.json({ result: resultImage });
        }

        throw new Error('No result image returned from API');

    } catch (error: any) {
        console.error('Virtual try-on error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to generate try-on. The service may be busy, please try again.' },
            { status: 500 }
        );
    }
}

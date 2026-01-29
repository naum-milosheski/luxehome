'use server';

import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function generateDescription(params: {
    title: string;
    location: string;
    stats: string;
    features: string[];
    amenities: string[];
}) {
    try {
        const { text } = await generateText({
            model: google('gemini-2.0-flash'),
            prompt: `Write a compelling luxury real estate listing description.

CRITICAL CONSTRAINTS:
1. Do NOT include a title or header. Start directly with the body text.
2. Incorporate these specific features: ${params.features.join(', ')}
3. Incorporate these amenities: ${params.amenities.join(', ')}
4. Property stats: ${params.stats}
5. Location: ${params.location}

TONE: Sophisticated, inviting, and professional.
LENGTH: Maximum 2 paragraphs.
STYLE: Focus on lifestyle and experience, not just features.`,
        });
        return text;
    } catch (error) {
        console.error('AI Generation Error:', error);
        return "Experience the epitome of luxury living in this stunning residence. (AI Generation Failed - Check API Key)";
    }
}

export async function analyzeImage(formData: FormData) {
    try {
        const file = formData.get('image') as File;
        if (!file) throw new Error('No image provided');

        const arrayBuffer = await file.arrayBuffer();
        const base64Image = Buffer.from(arrayBuffer).toString('base64');

        // Master amenities list - SINGLE SOURCE OF TRUTH
        const masterAmenities = [
            'pool', 'infinityPool', 'spa', 'sauna', 'gym',
            'oceanView', 'cityView', 'mountainView', 'waterfront',
            'homeTheater', 'wineCellar', 'smartHome', 'fireplace', 'elevator', 'guestHouse',
            'wifi', 'parking', 'security', 'gatedCommunity'
        ];

        const { text } = await generateText({
            model: google('gemini-2.0-flash'),
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: `Analyze this real estate image and detect ONLY amenities from this specific list: ${masterAmenities.join(', ')}.

CRITICAL RULES:
1. Return ONLY a JSON object with detected amenity keys
2. Use camelCa format exactly as provided
3. If you see something NOT on the list, IGNORE it
4. Be conservative - only return amenities you are CONFIDENT are visible

Example response: {"pool": true, "oceanView": true}

RESPOND WITH ONLY THE JSON OBJECT, NO OTHER TEXT.`
                        },
                        { type: 'image', image: base64Image }
                    ]
                }
            ]
        });

        // Parse JSON response
        try {
            const jsonMatch = text.match(/\{[^}]+\}/);
            if (jsonMatch) {
                const detectedAmenities = JSON.parse(jsonMatch[0]);
                return detectedAmenities;
            }
            return {};
        } catch (parseError) {
            console.error('Failed to parse AI response as JSON:', text);
            return {};
        }
    } catch (error) {
        console.error('AI Vision Error:', error);
        return {}; // Return empty object on error
    }
}

export async function scoreLead(message: string) {
    try {
        const { text } = await generateText({
            model: google('gemini-2.0-flash'),
            prompt: `Analyze the following real estate lead message and assign a "Lead Score" from 0 to 100 based on intent, urgency, and budget implication. Return ONLY the number. Message: "${message}"`,
        });
        const score = parseInt(text.trim());
        return isNaN(score) ? 50 : score;
    } catch (error) {
        console.error('AI Scoring Error:', error);
        return 50; // Default score
    }
}

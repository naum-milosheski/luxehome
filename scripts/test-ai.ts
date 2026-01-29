import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
    console.log('Testing Gemini API...');
    console.log('API Key present:', !!process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    try {
        const { text } = await generateText({
            model: google('gemini-2.0-flash'),
            prompt: 'Say hello!',
        });
        console.log('Success! Response:', text);
    } catch (error) {
        console.error('Error:', error);
    }
}

main();

import { NextResponse } from 'next/server'

// Simple proxy to Google Generative (Gemini) API. Requires env var GOOGLE_API_KEY.
// POST body: { message: string }
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = body.message;

    if (!message) {
      return NextResponse.json({ error: 'Missing message' }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Server missing GOOGLE_API_KEY' }, { status: 500 });
    }

    // Basic call to Google Generative Text API v1 (adjust model if needed)
    const resp = await fetch('https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: {
          text: message
        },
        // tune response length/options as needed
        maxOutputTokens: 256
      })
    });

    if (!resp.ok) {
      const t = await resp.text();
      return NextResponse.json({ error: 'Generative API error', detail: t }, { status: resp.status });
    }

    const json = await resp.json();

    // Extract best text
    const output = json?.candidates?.[0]?.content || json?.output?.[0]?.content || JSON.stringify(json);

    return NextResponse.json({ reply: output });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}

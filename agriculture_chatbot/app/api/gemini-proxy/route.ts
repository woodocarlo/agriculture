import { NextRequest, NextResponse } from 'next/server';

// ---------------------------------------------------------
// PASTE YOUR API KEY HERE ONE LAST TIME
// ---------------------------------------------------------
const apiKey = '**'; 

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const prompt = body.prompt;

    if (!prompt) {
      return NextResponse.json({ error: 'Missing prompt in request body' }, { status: 400 });
    }

    // FIXED: Using a valid model from YOUR list
    const modelName = 'gemini-2.5-flash'; 
    
    // Using v1beta (v1beta2 was the cause of your very first error)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      }),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("Gemini API Error:", errorText);
      return NextResponse.json({ error: 'Gemini API error', details: errorText }, { status: geminiResponse.status });
    }

    const data = await geminiResponse.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: 'Server error', details: error.message }, { status: 500 });
  }
}
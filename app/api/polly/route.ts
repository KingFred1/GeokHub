import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import { NextResponse } from "next/server";

const pollyClient = new PollyClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Handle POST requests
export async function POST(request: Request) {
  try {
    const { text, voiceId = "Joanna" } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Valid text is required" },
        { status: 400 }
      );
    }

    const safeText = text.slice(0, 3000); // Polly's character limit

    const command = new SynthesizeSpeechCommand({
      OutputFormat: "mp3",
      Text: safeText,
      VoiceId: voiceId,
      Engine: "neural",
    });

    const data = await pollyClient.send(command);
    const chunks: Uint8Array[] = [];
    const audioStream = data.AudioStream as AsyncIterable<Uint8Array>;
    
    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }

    return NextResponse.json({
      audio: Buffer.concat(chunks).toString("base64"),
      voiceId,
      textLength: safeText.length,
    });

  } catch (error) {
    console.error("Polly error:", error);
    return NextResponse.json(
      { error: "Failed to generate speech" },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
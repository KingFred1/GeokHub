import { NextResponse } from 'next/server';

export async function GET() {
  const privateKey = process.env.GOOGLE_INDEXING_PRIVATE_KEY;
  const clientEmail = process.env.GOOGLE_INDEXING_SERVICE_ACCOUNT_EMAIL;
  
  // Check if environment variables are loaded
  const envVarsLoaded = !!privateKey && !!clientEmail;
  
  // Analyze the private key
  const keyAnalysis = {
    exists: !!privateKey,
    length: privateKey?.length,
    startsWithCorrect: privateKey?.startsWith('-----BEGIN PRIVATE KEY-----'),
    endsWithCorrect: privateKey?.endsWith('-----END PRIVATE KEY-----\\n'),
    containsNewlines: privateKey?.includes('\\n'),
    first50Chars: privateKey?.substring(0, 50),
    last50Chars: privateKey?.substring(privateKey.length - 50)
  };

  return NextResponse.json({
    environment: {
      googleConfigured: envVarsLoaded,
      serviceAccountEmail: clientEmail,
      projectId: process.env.GOOGLE_INDEXING_PROJECT_ID
    },
    privateKeyAnalysis: keyAnalysis,
    rawPrivateKeyPreview: privateKey ? privateKey.substring(0, 100) + '...' : 'Not found'
  });
}
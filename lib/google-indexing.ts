// import { google } from 'googleapis';

const privateKey = process.env.GOOGLE_INDEXING_PRIVATE_KEY?.replace(/\\n/g, '\n');
const clientEmail = process.env.GOOGLE_INDEXING_SERVICE_ACCOUNT_EMAIL;

if (!privateKey || !clientEmail) {
  console.warn('Google Indexing API credentials not found. Google indexing will be disabled.');
}

// Define proper TypeScript interfaces
interface GoogleIndexingResponse {
  success: boolean;
  message: string;
  configured: boolean;
  error?: string;
}

// Helper function to clean private key
function cleanGooglePrivateKey(privateKey: string): string {
  // Remove surrounding quotes if present
  let cleaned = privateKey.replace(/^"|"$/g, '');
  
  // Replace escaped newlines with actual newlines
  cleaned = cleaned.replace(/\\n/g, '\n');
  
  // Ensure it starts and ends correctly
  if (!cleaned.startsWith('-----BEGIN PRIVATE KEY-----')) {
    cleaned = '-----BEGIN PRIVATE KEY-----\n' + cleaned;
  }
  if (!cleaned.endsWith('-----END PRIVATE KEY-----')) {
    cleaned = cleaned + '\n-----END PRIVATE KEY-----';
  }
  
  return cleaned;
}

// Google indexing function with proper typing
export async function submitToGoogleIndexing(url: string): Promise<GoogleIndexingResponse> {
  const privateKey = process.env.GOOGLE_INDEXING_PRIVATE_KEY;
  const clientEmail = process.env.GOOGLE_INDEXING_SERVICE_ACCOUNT_EMAIL;

  if (!privateKey || !clientEmail) {
    return { 
      success: false, 
      message: 'Google Indexing API not configured',
      configured: false 
    };
  }

  try {
    // Clean and normalize the private key
    const cleanPrivateKey = cleanGooglePrivateKey(privateKey);
    
    console.log('🔧 Cleaned private key length:', cleanPrivateKey.length);
    console.log('🔧 Private key starts with:', cleanPrivateKey.substring(0, 50));
    
    const { google } = await import('googleapis');
    
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: cleanPrivateKey,
      },
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });

    const indexing = google.indexing({
      version: 'v3',
      auth: auth,
    });

    const response = await indexing.urlNotifications.publish({
      requestBody: {
        url: url,
        type: 'URL_UPDATED',
      },
    });

    console.log(`✅ Successfully submitted to Google Indexing: ${url}`);
    console.log(`📊 Google API response:`, response.status, response.statusText);
    
    return {
      success: true,
      message: 'Submitted to Google Indexing API',
      configured: true
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorCode = (error as { code?: number }).code;
    
    console.error('❌ Google Indexing API error:', errorMessage);
    
    // Handle specific Google API errors
    if (errorCode === 403) {
      return {
        success: false,
        message: 'Permission denied. Verify domain ownership and service account permissions.',
        configured: true,
        error: 'Permission denied'
      };
    } else if (errorCode === 429) {
      return {
        success: false,
        message: 'Rate limit exceeded. Too many requests to Google Indexing API.',
        configured: true,
        error: 'Rate limit exceeded'
      };
    }
    
    return {
      success: false,
      message: `Google Indexing API error: ${errorMessage}`,
      configured: true,
      error: errorMessage
    };
  }
}

// Check if URL is eligible for Google Indexing API
export function isEligibleForGoogleIndexing(documentType: string): boolean {
  const eligibleTypes = ['jobPosting', 'liveStream', 'broadcastEvent', 'video'];
  const isEligibleType = eligibleTypes.includes(documentType);
  
  // For blog posts, we can still submit but with lower priority
  const isBlogContent = documentType === 'post' || documentType === 'article';
  
  return isEligibleType || isBlogContent;
}
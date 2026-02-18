// import { NextRequest, NextResponse } from 'next/server';

// const API_KEY = process.env.INDEXNOW_KEY || 'beb4ccd0e4654b1489f99a669e7e7324';
// const HOST = process.env.NEXTAUTH_URL || 'https://www.geokhub.com';

// // FIX: Remove trailing slashes and ensure proper URL format
// const cleanHost = HOST.replace(/\/+$/, '');
// const KEY_LOCATION = `${cleanHost}/${API_KEY}.txt`;

// // Define proper TypeScript interfaces
// interface GoogleIndexingResponse {
//   success: boolean;
//   message: string;
//   response?: unknown;
//   configured?: boolean;
//   error?: string;
// }

// interface IndexNowResponse {
//   success: boolean;
//   message?: string;
//   error?: string;
//   details?: string;
//   status?: number;
// }

// interface WebhookPayload {
//   slug: string;
//   documentType?: string;
//   contentType?: string | null;
//   documentId?: string;
//   isDraft?: boolean;
//   publishedAt?: string;
// }

// interface ApiResponse {
//   success: boolean;
//   message: string;
//   url: string;
//   document: {
//     type?: string;
//     id?: string;
//     contentType?: string | null;
//     publishedAt?: string;
//     googleEligible: boolean;
//   };
//   timestamp: string;
//   results: {
//     indexNow: IndexNowResponse & { engine: string };
//     google: GoogleIndexingResponse & { engine: string };
//   };
//   summary: {
//     submittedToIndexNow: boolean;
//     submittedToGoogle: boolean;
//     googleConfigured: boolean;
//     totalEngines: number;
//   };
// }

// // Google Indexing API utility function (keep as is)
// async function submitToGoogleIndexing(url: string, operation: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED'): Promise<GoogleIndexingResponse> {
//   const privateKey = process.env.GOOGLE_INDEXING_PRIVATE_KEY?.replace(/\\n/g, '\n');
//   const clientEmail = process.env.GOOGLE_INDEXING_SERVICE_ACCOUNT_EMAIL;

//   if (!privateKey || !clientEmail) {
//     return { 
//       success: false, 
//       message: 'Google Indexing API not configured',
//       configured: false 
//     };
//   }

//   try {
//     const { google } = await import('googleapis');
    
//     const auth = new google.auth.GoogleAuth({
//       credentials: {
//         client_email: clientEmail,
//         private_key: privateKey,
//       },
//       scopes: ['https://www.googleapis.com/auth/indexing'],
//     });

//     const indexing = google.indexing({
//       version: 'v3',
//       auth: auth,
//     });

//     const response = await indexing.urlNotifications.publish({
//       requestBody: {
//         url: url,
//         type: operation,
//       },
//     });

//     console.log(`✅ Successfully submitted to Google Indexing: ${url}`);
//     return {
//       success: true,
//       message: 'Submitted to Google Indexing API',
//       response: response.data,
//       configured: true
//     };
//   } catch (error: unknown) {
//     const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
//     const errorCode = (error as { code?: number }).code;
    
//     console.error('❌ Google Indexing API error:', errorMessage);
    
//     if (errorCode === 403) {
//       return {
//         success: false,
//         error: 'Permission denied. Verify domain ownership and service account permissions.',
//         configured: true
//       };
//     } else if (errorCode === 429) {
//       return {
//         success: false,
//         error: 'Rate limit exceeded. Too many requests to Google Indexing API.',
//         configured: true
//       };
//     }
    
//     return {
//       success: false,
//       error: `Google Indexing API error: ${errorMessage}`,
//       configured: true
//     };
//   }
// }

// function isEligibleForGoogleIndexing(documentType: string | undefined, contentType: string | null | undefined): boolean {
//   const effectiveContentType = contentType || "article";
  
//   const highPriorityTypes = ['jobPosting', 'liveStream', 'broadcastEvent', 'video'];
//   const isHighPriority = highPriorityTypes.includes(documentType || '') || highPriorityTypes.includes(effectiveContentType);
  
//   const isBlogContent = ['post', 'article', 'blogPost'].includes(documentType || '') || 
//                        ['article', 'tutorial', 'news'].includes(effectiveContentType);
  
//   return isHighPriority || isBlogContent;
// }

// // UPDATED IndexNow submission function for new API
// async function submitToIndexNow(url: string): Promise<IndexNowResponse> {
//   try {
//     // Get the hostname without protocol
//     const hostname = new URL(cleanHost).hostname;
    
//     // NEW: Submit to multiple IndexNow endpoints for better coverage
//     const endpoints = [
//       'https://api.indexnow.org/indexnow', // Primary endpoint
//       'https://www.bing.com/indexnow',      // Bing endpoint
//       'https://yandex.com/indexnow'         // Yandex endpoint
//     ];

//     const payload = {
//       host: hostname,
//       key: API_KEY,
//       keyLocation: KEY_LOCATION,
//       urlList: [url],
//     };

//     console.log('🔑 IndexNow Payload:', JSON.stringify(payload, null, 2));

//     let lastError: string = '';
//     let lastStatus: number = 0;

//     // Try multiple endpoints
//     for (const endpoint of endpoints) {
//       try {
//         console.log(`🔄 Trying IndexNow endpoint: ${endpoint}`);
        
//         const controller = new AbortController();
//         const timeoutId = setTimeout(() => controller.abort(), 8000);

//         const response = await fetch(endpoint, {
//           method: 'POST',
//           headers: { 
//             'Content-Type': 'application/json; charset=utf-8',
//             'User-Agent': 'Geokhub-Sanity-Webhook/1.0'
//           },
//           body: JSON.stringify(payload),
//           signal: controller.signal
//         });

//         clearTimeout(timeoutId);

//         const responseText = await response.text();
//         lastStatus = response.status;
        
//         if (response.ok) {
//           console.log(`✅ IndexNow submission successful via ${endpoint}`);
          
//           // Different responses from different endpoints
//           if (endpoint.includes('bing.com')) {
//             return { 
//               success: true, 
//               message: 'Submitted to Bing via IndexNow',
//               status: response.status
//             };
//           } else if (endpoint.includes('yandex.com')) {
//             return { 
//               success: true, 
//               message: 'Submitted to Yandex via IndexNow',
//               status: response.status
//             };
//           }
          
//           return { 
//             success: true, 
//             message: 'Submitted to IndexNow',
//             status: response.status
//           };
//         } else {
//           console.log(`⚠️  ${endpoint} returned ${response.status}: ${responseText}`);
//           lastError = `${endpoint}: ${response.status} ${responseText}`;
          
//           // If we get a 400 error from IndexNow, it might be due to API key validation
//           if (response.status === 400) {
//             // Check if key file is accessible
//             try {
//               const keyCheck = await fetch(KEY_LOCATION);
//               if (!keyCheck.ok) {
//                 return { 
//                   success: false, 
//                   error: `IndexNow key file not accessible at ${KEY_LOCATION}`,
//                   details: 'Make sure the key file is publicly accessible',
//                   status: response.status
//                 };
//               }
//             } catch (keyError) {
//               return { 
//                 success: false, 
//                 error: `Cannot access key file: ${KEY_LOCATION}`,
//                 details: 'Key file might not be publicly accessible',
//                 status: response.status
//               };
//             }
//           }
//         }
//       } catch (error: unknown) {
//         if (error instanceof Error && error.name === 'AbortError') {
//           console.log(`⏱️  Timeout for ${endpoint}`);
//           lastError = `${endpoint}: Timeout`;
//           continue;
//         }
//         const errorMessage = error instanceof Error ? error.message : 'Unknown error';
//         console.log(`⚠️  Error with ${endpoint}: ${errorMessage}`);
//         lastError = `${endpoint}: ${errorMessage}`;
//       }
//     }

//     // If all endpoints failed, try the legacy approach
//     console.log('🔄 Trying legacy single URL submission...');
//     return await submitSingleUrlToIndexNow(hostname, url);

//   } catch (error: unknown) {
//     const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
//     return { 
//       success: false, 
//       error: `IndexNow submission failed: ${errorMessage}` 
//     };
//   }
// }

// // Legacy method for single URL submission (some endpoints still accept this)
// async function submitSingleUrlToIndexNow(hostname: string, url: string): Promise<IndexNowResponse> {
//   try {
//     const legacyPayload = {
//       host: hostname,
//       key: API_KEY,
//       keyLocation: KEY_LOCATION,
//       url: url, // SINGLE url instead of urlList
//     };

//     const response = await fetch('https://api.indexnow.org/indexnow', {
//       method: 'POST',
//       headers: { 
//         'Content-Type': 'application/json; charset=utf-8',
//         'User-Agent': 'Geokhub-Sanity-Webhook/1.0'
//       },
//       body: JSON.stringify(legacyPayload),
//     });

//     const responseText = await response.text();
    
//     if (response.ok) {
//       return { 
//         success: true, 
//         message: 'Submitted via legacy method',
//         status: response.status
//       };
//     } else {
//       return { 
//         success: false, 
//         error: `Legacy method failed: ${response.status}`,
//         details: responseText,
//         status: response.status
//       };
//     }
//   } catch (error: unknown) {
//     const errorMessage = error instanceof Error ? error.message : 'Unknown error';
//     return { 
//       success: false, 
//       error: `Legacy method error: ${errorMessage}` 
//     };
//   }
// }

// // Function to verify IndexNow setup
// async function verifyIndexNowSetup() {
//   console.log('🔍 Verifying IndexNow setup...');
  
//   try {
//     // Check if key file exists and is accessible
//     const keyResponse = await fetch(KEY_LOCATION);
//     const keyAccessible = keyResponse.ok;
    
//     if (!keyAccessible) {
//       console.error(`❌ IndexNow key file not accessible at: ${KEY_LOCATION}`);
//       console.error(`   Make sure ${API_KEY}.txt is publicly accessible at your site root`);
//       return false;
//     }
    
//     const keyContent = await keyResponse.text();
//     const keyMatch = keyContent.trim() === API_KEY;
    
//     if (!keyMatch) {
//       console.error(`❌ Key file content mismatch`);
//       console.error(`   Expected: ${API_KEY}`);
//       console.error(`   Got: ${keyContent.trim()}`);
//       return false;
//     }
    
//     console.log(`✅ IndexNow key file verified: ${KEY_LOCATION}`);
//     return true;
//   } catch (error) {
//     console.error(`❌ Cannot verify key file: ${error instanceof Error ? error.message : 'Unknown error'}`);
//     return false;
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const body: WebhookPayload = await request.json();
    
//     console.log('📨 Received webhook payload:', JSON.stringify(body, null, 2));

//     // Validate the payload structure
//     if (!body.slug) {
//       console.warn('❌ Missing slug in payload');
//       return NextResponse.json(
//         { 
//           error: 'Slug is required in payload',
//           received: Object.keys(body) 
//         },
//         { status: 400 }
//       );
//     }

//     // Skip draft documents
//     if (body.isDraft) {
//       console.log('⏭️ Draft document ignored:', body.documentId);
//       return NextResponse.json(
//         { 
//           message: 'Draft document ignored',
//           documentId: body.documentId 
//         },
//         { status: 200 }
//       );
//     }

//     // Validate slug format
//     const slugRegex = /^[a-zA-Z0-9-]+$/;
//     if (typeof body.slug !== 'string' || !slugRegex.test(body.slug)) {
//       console.warn('❌ Invalid slug format:', body.slug);
//       return NextResponse.json(
//         { error: 'Invalid slug format. Only letters, numbers, and hyphens are allowed.' },
//         { status: 400 }
//       );
//     }

//     // Construct the full URL
//     const url = generateUrl(body);
    
//     console.log('🚀 Submitting URL to search engines:', url);

//     // Verify IndexNow setup first
//     const setupVerified = await verifyIndexNowSetup();
//     if (!setupVerified) {
//       console.warn('⚠️ IndexNow setup verification failed. Submissions may fail.');
//     }

//     // Submit to both IndexNow and Google Indexing API in parallel
//     const [indexNowResult, googleResult] = await Promise.allSettled([
//       submitToIndexNow(url),
      
//       isEligibleForGoogleIndexing(body.documentType, body.contentType) 
//         ? submitToGoogleIndexing(url)
//         : Promise.resolve({ 
//             success: false, 
//             message: 'Not eligible for Google Indexing API',
//             configured: false 
//           })
//     ]);

//     // Process results
//     const indexNowFinal = indexNowResult.status === 'fulfilled' 
//       ? indexNowResult.value 
//       : { success: false, error: 'IndexNow submission failed' };

//     const googleFinal = googleResult.status === 'fulfilled' 
//       ? googleResult.value 
//       : { success: false, error: 'Google submission failed', configured: false };

//     // Prepare comprehensive response
//     const successResponse: ApiResponse = {
//       success: indexNowFinal.success || googleFinal.success,
//       message: indexNowFinal.success 
//         ? 'URL submitted to search engines via IndexNow' 
//         : 'URL submission partially failed',
//       url,
//       document: {
//         type: body.documentType,
//         id: body.documentId,
//         contentType: body.contentType,
//         publishedAt: body.publishedAt,
//         googleEligible: isEligibleForGoogleIndexing(body.documentType, body.contentType)
//       },
//       timestamp: new Date().toISOString(),
//       results: {
//         indexNow: {
//           ...indexNowFinal,
//           engine: 'IndexNow (Bing, Yandex, etc.)'
//         },
//         google: {
//           ...googleFinal,
//           engine: 'Google Indexing API'
//         }
//       },
//       summary: {
//         submittedToIndexNow: indexNowFinal.success,
//         submittedToGoogle: googleFinal.success,
//         googleConfigured: googleFinal.configured !== false,
//         totalEngines: [indexNowFinal.success, googleFinal.success].filter(Boolean).length
//       }
//     };

//     return NextResponse.json(successResponse);

//   } catch (error: unknown) {
//     const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
//     console.error('❌ Server error in API:', error);
//     return NextResponse.json(
//       { 
//         error: 'Internal server error',
//         details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
//       },
//       { status: 500 }
//     );
//   }
// }

// function generateUrl(webhookData: WebhookPayload): string {
//   const slug = webhookData.slug;
  
//   if (webhookData.contentType === 'tutorial') {
//     return `${cleanHost}/tutorials/${slug}`;
//   }
  
//   if (webhookData.contentType === 'news') {
//     return `${cleanHost}/news/${slug}`;
//   }
  
//   return `${cleanHost}/blogs/${slug}`;
// }

// // Enhanced GET endpoint
// export async function GET(request: NextRequest) {
//   const url = new URL(request.url);
//   const checkKey = url.searchParams.get('checkKey');
  
//   if (checkKey === 'true') {
//     try {
//       // Verify key file
//       const keyResponse = await fetch(KEY_LOCATION);
//       const keyAccessible = keyResponse.ok;
//       const keyContent = keyAccessible ? await keyResponse.text() : null;
      
//       // Check Google configuration
//       const googleConfigured = !!(process.env.GOOGLE_INDEXING_SERVICE_ACCOUNT_EMAIL && 
//                                  process.env.GOOGLE_INDEXING_PRIVATE_KEY);
      
//       // Test submission endpoints
//       const endpoints = [
//         'https://api.indexnow.org/indexnow',
//         'https://www.bing.com/indexnow',
//         'https://yandex.com/indexnow'
//       ];
      
//       const endpointStatus = await Promise.all(
//         endpoints.map(async (endpoint) => {
//           try {
//             const testResponse = await fetch(endpoint, {
//               method: 'HEAD',
//               headers: { 'User-Agent': 'Geokhub-Test/1.0' }
//             });
//             return {
//               endpoint,
//               accessible: testResponse.ok,
//               status: testResponse.status
//             };
//           } catch {
//             return {
//               endpoint,
//               accessible: false,
//               status: 0
//             };
//           }
//         })
//       );

//       return NextResponse.json({
//         status: 'healthy',
//         services: {
//           indexNow: {
//             configured: true,
//             key: API_KEY,
//             keyFile: {
//               url: KEY_LOCATION,
//               accessible: keyAccessible,
//               contentMatch: keyContent?.trim() === API_KEY ? '✅ Match' : '❌ Mismatch',
//               actualContent: keyContent?.trim()
//             },
//             endpoints: endpointStatus
//           },
//           googleIndexing: {
//             configured: googleConfigured,
//             serviceAccount: process.env.GOOGLE_INDEXING_SERVICE_ACCOUNT_EMAIL || 'Not configured',
//             ready: googleConfigured,
//           }
//         },
//         testUrls: {
//           keyFile: KEY_LOCATION,
//           exampleUrl: `${cleanHost}/blogs/test-post`,
//           submissionExample: `${cleanHost}/api/indexnow`
//         },
//         timestamp: new Date().toISOString()
//       });
//     } catch (error: unknown) {
//       const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
//       return NextResponse.json({
//         status: 'error',
//         error: errorMessage
//       }, { status: 500 });
//     }
//   }
  
//   return NextResponse.json({
//     message: 'Search Engine Indexing API',
//     note: 'IndexNow now supports Bing, Yandex, Seznam, and other search engines',
//     usage: {
//       healthCheck: `${request.url}?checkKey=true`,
//       submitUrl: 'POST {"slug": "your-post-slug"} to this endpoint'
//     },
//     requirements: [
//       `Key file must be accessible at: ${KEY_LOCATION}`,
//       'Key file content must match your API key',
//       'Supports bulk indexing via POST with multiple URLs'
//     ]
//   });
// }
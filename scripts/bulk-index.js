import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import { createWriteStream } from 'fs';
import { join } from 'path';

console.log("🚀 Starting bulk-index-fixed.js script");

// Load .env variables
dotenv.config();

// Create logs directory
const logsDir = join(process.cwd(), 'logs');
import { mkdir, writeFile } from 'fs/promises';
try {
  await mkdir(logsDir, { recursive: true });
} catch {}

// Polyfill fetch if needed
if (typeof fetch === 'undefined') {
  const { default: fetch } = await import('node-fetch');
  global.fetch = fetch;
}

// Sanity client configuration
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '78gw77n7',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.geokhub.com';
const API_ENDPOINT = `${BASE_URL}/api/indexnow`;
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || 'beb4ccd0e4654b1489f99a669e7e7324';

// Global category map used to resolve parent slugs when needed
let CATEGORY_MAP = {};

// Build the public URL for a post based on categories and content type
function getPathFromCategory(cat) {
  if (!cat) return null;

  // If category has a parent, prefer parent/child path
  if (cat.parent && cat.parent.slug) {
    return `/${cat.parent.slug}/${cat.slug}`;
  }

  // If parent info missing on the category, consult the global CATEGORY_MAP
  const mappedParent = CATEGORY_MAP[cat.slug]?.parentSlug;
  if (mappedParent) {
    return `/${mappedParent}/${cat.slug}`;
  }

  // Special handling for news sub-sections
  if (cat.slug === 'world') return `/news/world`;
  if (cat.slug === 'business') return `/news/business`;
  if (cat.slug === 'news') return `/news`;

  // Default: top-level category path
  return `/${cat.slug}`;
}

function getPublicUrlForPost(post) {
  // Tutorials and special content types
  if (post.contentType === 'tutorial') return `${BASE_URL}/tutorials/${post.slug}`;

  // If categories exist, we try to pick the most specific candidate
  if (post.categories && post.categories.length > 0) {
    // Prefer a category that has a parent, or one matching known sections
    // 1) Find category with parent
    const withParent = post.categories.find(c => c.parent && c.parent.slug);
    if (withParent) {
      return `${BASE_URL}${getPathFromCategory(withParent)}/${post.slug}`;
    }

    // 2) Find news/world/business first
    const newsLike = post.categories.find(c => ['news','world','business'].includes(c.slug));
    if (newsLike) {
      return `${BASE_URL}${getPathFromCategory(newsLike)}/${post.slug}`;
    }

    // 3) Fallback to first category
    return `${BASE_URL}${getPathFromCategory(post.categories[0])}/${post.slug}`;
  }

  // Default: /blogs/<slug>
  return `${BASE_URL}/blogs/${post.slug}`;
}

// Log results to file
const logStream = createWriteStream(join(logsDir, 'bulk-index.log'), { flags: 'a' });
const errorStream = createWriteStream(join(logsDir, 'bulk-index-errors.log'), { flags: 'a' });

function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  logStream.write(logMessage);
  console.log(message);
}

function logError(message) {
  const timestamp = new Date().toISOString();
  const errorMessage = `[${timestamp}] ${message}\n`;
  errorStream.write(errorMessage);
  console.error(message);
}

// Test API endpoint connectivity with better error handling
async function testApiConnectivity() {
  log('🔍 Testing API endpoint connectivity...');
  
  try {
    // Try GET first (since your API has GET handler)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    log(`   Testing: ${API_ENDPOINT}?checkKey=true`);
    
    const response = await fetch(`${API_ENDPOINT}?checkKey=true`, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Geokhub-Bulk-Indexer/1.0',
        'Accept': 'application/json'
      }
    });

    clearTimeout(timeoutId);

    // Try to read response text for debugging
    let responseText = '';
    try {
      responseText = await response.text();
    } catch (e) {
      responseText = 'Could not read response';
    }

    if (response.ok) {
      try {
        const result = JSON.parse(responseText);
        log('✅ API endpoint is reachable');
        log(`📊 Health check: ${JSON.stringify(result, null, 2)}`);
        return true;
      } catch (parseError) {
        log(`✅ API endpoint is reachable (status: ${response.status})`);
        log(`   Raw response: ${responseText.substring(0, 200)}`);
        return true;
      }
    } else {
      logError(`❌ API returned status ${response.status} ${response.statusText}`);
      logError(`   Response: ${responseText.substring(0, 500)}`);
      
      // Check if it's a 404/405 which means endpoint doesn't exist
      if (response.status === 404 || response.status === 405) {
        logError('   ⚠️ This usually means:');
        logError('      1. Your Next.js app is not running');
        logError('      2. The API route does not exist at this URL');
        logError('      3. CORS or other middleware is blocking the request');
      }
      return false;
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      logError('❌ API connection timeout (15s)');
      logError('   Make sure your site is running: npm run dev');
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      logError(`❌ Cannot connect to ${BASE_URL}`);
      logError('   The site is not running or DNS is not resolving');
    } else {
      logError(`❌ API connection error: ${error.message}`);
    }
    return false;
  }
}

// Direct IndexNow submission function
async function submitDirectToIndexNow(post) {
  const startTime = Date.now();
  
  try {
    const host = 'www.geokhub.com';
    const finalUrl = getPublicUrlForPost(post);
    
    log(`   🌐 Direct submission to IndexNow: ${finalUrl}`);

    const payload = {
      host: host,
      key: INDEXNOW_KEY,
      keyLocation: `https://${host}/${INDEXNOW_KEY}.txt`,
      urlList: [finalUrl],
    };

    // Try multiple IndexNow endpoints
    const endpoints = [
      'https://api.indexnow.org/indexnow',
      'https://www.bing.com/indexnow',
      'https://yandex.com/indexnow'
    ];

    let lastError = '';
    let lastStatus = 0;

    for (const endpoint of endpoints) {
      try {
        log(`   🔄 Trying endpoint: ${endpoint.replace('https://', '')}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'User-Agent': 'Geokhub-Bulk-Indexer/1.0'
          },
          body: JSON.stringify(payload),
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        
        const responseText = await response.text();
        const elapsed = Date.now() - startTime;
        lastStatus = response.status;

        if (response.ok) {
          log(`   ✅ Direct success (${elapsed}ms) via ${endpoint.replace('https://', '')}`);
          return { 
            success: true, 
            method: 'direct',
            endpoint: endpoint,
            elapsed,
            status: response.status
          };
        } else {
          log(`   ⚠️ ${endpoint.replace('https://', '')}: ${response.status} - ${responseText.substring(0, 100)}`);
          lastError = `${endpoint}: ${response.status} ${responseText}`;
        }
      } catch (error) {
        const elapsed = Date.now() - startTime;
        if (error.name === 'AbortError') {
          log(`   ⏱️ Timeout for ${endpoint.replace('https://', '')} (${elapsed}ms)`);
          lastError = `${endpoint}: Timeout`;
        } else {
          log(`   ❌ Error with ${endpoint.replace('https://', '')}: ${error.message}`);
          lastError = `${endpoint}: ${error.message}`;
        }
      }
    }

    // If all endpoints failed, try legacy single URL method
    log('   🔄 Trying legacy single URL method...');
    try {
      const legacyPayload = {
        host: host,
        key: INDEXNOW_KEY,
        keyLocation: `https://${host}/${INDEXNOW_KEY}.txt`,
        url: finalUrl, // Single URL instead of urlList
      };

      const response = await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'User-Agent': 'Geokhub-Bulk-Indexer/1.0'
        },
        body: JSON.stringify(legacyPayload),
      });

      const responseText = await response.text();
      const elapsed = Date.now() - startTime;

      if (response.ok) {
        log(`   ✅ Legacy method success (${elapsed}ms)`);
        return { 
          success: true, 
          method: 'direct-legacy',
          endpoint: 'api.indexnow.org',
          elapsed,
          status: response.status
        };
      } else {
        log(`   ❌ Legacy method failed: ${response.status} - ${responseText.substring(0, 100)}`);
        lastError = `Legacy: ${response.status} ${responseText}`;
      }
    } catch (legacyError) {
      log(`   ❌ Legacy method error: ${legacyError.message}`);
    }

    const elapsed = Date.now() - startTime;
    return { 
      success: false, 
      method: 'direct',
      error: `All IndexNow endpoints failed: ${lastError}`,
      elapsed,
      status: lastStatus
    };

  } catch (error) {
    const elapsed = Date.now() - startTime;
    log(`   ❌ Direct submission error: ${error.message}`);
    return { 
      success: false, 
      method: 'direct',
      error: error.message,
      elapsed
    };
  }
}

// Submit single post with fallback to direct submission
async function submitPost(post, index, total) {
  const startTime = Date.now();
  
  log(`\n📦 Processing ${index + 1}/${total}: ${post.title}`);
  log(`   Slug: ${post.slug}`);
  log(`   Public URL: ${getPublicUrlForPost(post)}`);
  log(`   Published: ${post.publishedAt}`);
  log(`   Categories: ${post.categories?.map(c => c.slug).join(', ') || 'None'}`);

  // Determine content type
  let contentType = post.contentType || 'article';
  if (post.categories?.some(c => ['news', 'world', 'business'].includes(c.slug))) {
    contentType = 'news';
  } else if (post.categories?.some(c => c.slug === 'tutorial')) {
    contentType = 'tutorial';
  }

  const payload = {
    slug: post.slug,
    url: getPublicUrlForPost(post),
    publishedAt: post.publishedAt,
    documentType: post._type,
    documentId: post._id,
    isDraft: post._id.includes('drafts.'),
    contentType: contentType,
  };

  // First try via API endpoint
  try {
    log('   📤 Submitting to API endpoint...');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': 'Geokhub-Bulk-Indexer/1.0'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const elapsed = Date.now() - startTime;

    // Try to parse response as JSON
    let result = {};
    let responseText = '';
    
    try {
      responseText = await response.text();
      result = responseText ? JSON.parse(responseText) : {};
    } catch (parseError) {
      logError(`   ❌ Failed to parse response: ${parseError.message}`);
      logError(`   📝 Raw response: ${responseText.substring(0, 500)}`);
    }

    if (response.ok) {
      if (result.success || result.results?.indexNow?.success) {
        log(`✅ API Success (${elapsed}ms): ${result.url || getPublicUrlForPost(post)}`);
        if (result.results?.indexNow) {
          log(`   IndexNow: ${result.results.indexNow.success ? '✅' : '❌'} ${result.results.indexNow.message || ''}`);
        }
        if (result.results?.google) {
          log(`   Google: ${result.results.google.success ? '✅' : '❌'} ${result.results.google.message || ''}`);
        }
        return { 
          success: true, 
          method: 'api',
          post,
          details: result 
        };
      } else {
        logError(`❌ API returned OK but success=false (${elapsed}ms)`);
        logError(`   Response: ${JSON.stringify(result, null, 2)}`);
        // Fall back to direct submission
        return await tryDirectSubmission(post, elapsed);
      }
    } else {
      logError(`❌ API HTTP ${response.status} (${elapsed}ms)`);
      logError(`   Response: ${responseText.substring(0, 500)}`);
      // Fall back to direct submission
      return await tryDirectSubmission(post, elapsed);
    }
  } catch (error) {
    const elapsed = Date.now() - startTime;
    
    if (error.name === 'AbortError') {
      logError(`❌ API Timeout (${elapsed}ms): Request took too long`);
    } else {
      logError(`❌ API Network error (${elapsed}ms): ${error.message}`);
    }
    
    // Fall back to direct submission
    return await tryDirectSubmission(post, elapsed);
  }
}

// Helper function for direct submission fallback
async function tryDirectSubmission(post, previousElapsed) {
  log('   🔄 Falling back to direct IndexNow submission...');
  const directResult = await submitDirectToIndexNow(post);
  
  if (directResult.success) {
    return {
      success: true,
      method: directResult.method,
      post,
      details: directResult
    };
  } else {
    return {
      success: false,
      method: directResult.method,
      error: directResult.error,
      details: directResult,
      post
    };
  }
}

// Check key file accessibility
async function checkKeyFile() {
  log('\n🔑 Checking IndexNow key file accessibility...');
  const keyUrl = `https://www.geokhub.com/${INDEXNOW_KEY}.txt`;
  
  try {
    const response = await fetch(keyUrl, {
      method: 'GET',
      headers: { 'User-Agent': 'Geokhub-Key-Check/1.0' }
    });
    
    if (response.ok) {
      const keyContent = await response.text();
      const trimmedKey = keyContent.trim();
      
      if (trimmedKey === INDEXNOW_KEY) {
        log(`✅ Key file accessible and matches: ${keyUrl}`);
        return true;
      } else {
        logError(`❌ Key file content mismatch:`);
        logError(`   Expected: ${INDEXNOW_KEY}`);
        logError(`   Got: ${trimmedKey}`);
        return false;
      }
    } else {
      logError(`❌ Key file not accessible (HTTP ${response.status}): ${keyUrl}`);
      logError('   Make sure the key file is publicly accessible at your site root');
      return false;
    }
  } catch (error) {
    logError(`❌ Cannot access key file: ${error.message}`);
    return false;
  }
}

async function fetchCategoryMap() {
  log('📡 Fetching categories from Sanity to build CATEGORY_MAP...');
  try {
    const q = `*[_type == "category"]{ "slug": slug.current, "parentSlug": parent->slug.current, title }`;
    const categories = await client.fetch(q);
    CATEGORY_MAP = categories.reduce((acc, c) => {
      acc[c.slug] = { parentSlug: c.parentSlug || null, title: c.title || null };
      return acc;
    }, {});
    log(`🗺️ Loaded ${Object.keys(CATEGORY_MAP).length} categories into CATEGORY_MAP`);
  } catch (err) {
    logError(`❌ Failed to load categories map: ${err.message}`);
    CATEGORY_MAP = {};
  }
}

// Main bulk indexing function
async function bulkIndexSanityPosts() {
  log('🚀 Starting bulk indexing of Sanity blog posts...');
  log('📌 Base URL:', BASE_URL);
  log('📌 API Endpoint:', API_ENDPOINT);
  log('📌 IndexNow Key:', INDEXNOW_KEY);
  log('📌 Logs directory:', logsDir);

  // Check key file first
  const keyAccessible = await checkKeyFile();
  if (!keyAccessible) {
    logError('⚠️ IndexNow key file issue detected. Submissions may fail.');
    logError('   But continuing anyway as some endpoints might work...');
  }

  // Test connectivity first
  const isConnected = await testApiConnectivity();
  if (!isConnected) {
    logError('\n⚠️ API endpoint is not reachable, will use direct IndexNow submission only');
    logError('   This is okay - we can submit directly to IndexNow');
  } else {
    log('\n✅ API connectivity test passed');
  }

  try {
    // Fetch category map first to resolve parent slugs when missing on posts
    await fetchCategoryMap();

    // Fetch all published posts with pagination to avoid memory issues
    log('\n📡 Fetching posts from Sanity...');
    
    const query = `*[_type == "post" && !(_id in path("drafts.**")) && defined(publishedAt) && publishedAt <= now()]{
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      contentType,
      _type,
      categories[]->{
        "slug": slug.current,
        title,
        parent->{
          "slug": slug.current,
          title
        }
      }
    } | order(publishedAt desc)`;

    const allPosts = await client.fetch(query);
    
    log(`📝 Found ${allPosts.length} eligible published posts`);

    if (!allPosts.length) {
      log('❌ No posts found.');
      return;
    }

    // Show first few posts as sample
    const sampleSize = Math.min(5, allPosts.length);
    log(`📋 Sample of first ${sampleSize} posts:`);
    for (let i = 0; i < sampleSize; i++) {
      log(`   ${i + 1}. ${allPosts[i].title} (${getPublicUrlForPost(allPosts[i])})`);
    }

    // Calculate estimated time
    const avgTimePerPost = 1500; // milliseconds
    const estimatedTotalTime = (allPosts.length * avgTimePerPost) / 1000 / 60;
    log(`⏱️ Estimated time: ${estimatedTotalTime.toFixed(1)} minutes (${allPosts.length} posts × ~1.5s each)`);

    // Process posts in smaller batches
    const batchSize = 50;
    let successCount = 0;
    let errorCount = 0;
    const failedPosts = [];
    const successMethods = { api: 0, direct: 0, 'direct-legacy': 0 };
    const startTime = Date.now();

    for (let batchStart = 0; batchStart < allPosts.length; batchStart += batchSize) {
      const batch = allPosts.slice(batchStart, batchStart + batchSize);
      log(`\n📊 Processing batch ${Math.floor(batchStart/batchSize) + 1}/${Math.ceil(allPosts.length/batchSize)}`);
      
      for (let i = 0; i < batch.length; i++) {
        const post = batch[i];
        const globalIndex = batchStart + i;
        
        // Progress indicator every 10 posts or at the start of each batch
        if (globalIndex % 10 === 0 || i === 0) {
          const progress = ((globalIndex + 1) / allPosts.length * 100).toFixed(1);
          const elapsedMinutes = (Date.now() - startTime) / 1000 / 60;
          const estimatedRemaining = (allPosts.length - globalIndex - 1) * avgTimePerPost / 1000 / 60;
          
          log(`📈 Progress: ${globalIndex + 1}/${allPosts.length} (${progress}%)`);
          log(`   ⏱️ Elapsed: ${elapsedMinutes.toFixed(1)}min | Remaining: ~${estimatedRemaining.toFixed(1)}min`);
          log(`   ✅ Successful: ${successCount} | ❌ Failed: ${errorCount}`);
        }
        
        const result = await submitPost(post, globalIndex, allPosts.length);
        
        if (result.success) {
          successCount++;
          successMethods[result.method] = (successMethods[result.method] || 0) + 1;
        } else {
          errorCount++;
          failedPosts.push({
            post: {
              title: post.title,
              slug: post.slug,
              id: post._id
            },
            error: result.error,
            method: result.method,
            details: result.details
          });
        }

        // Rate limiting: wait 500ms between requests (reduced from 1000ms for faster processing)
        if (globalIndex < allPosts.length - 1) {
          await new Promise((res) => setTimeout(res, 500));
        }
      }
    }

    // Final summary
    const totalElapsedMinutes = (Date.now() - startTime) / 1000 / 60;
    
    log('\n' + '='.repeat(60));
    log('🎉 BULK INDEXING COMPLETED!');
    log('='.repeat(60));
    log(`⏱️ Total time: ${totalElapsedMinutes.toFixed(1)} minutes`);
    log(`✅ Successful: ${successCount}`);
    log(`❌ Failed: ${errorCount}`);
    log(`📊 Total processed: ${allPosts.length}`);
    log(`📈 Success rate: ${((successCount / allPosts.length) * 100).toFixed(1)}%`);
    
    log('\n📊 Success by method:');
    Object.entries(successMethods).forEach(([method, count]) => {
      const percentage = ((count / successCount) * 100).toFixed(1);
      log(`   ${method}: ${count} posts (${percentage}%)`);
    });

    // Save failed posts for retry
    if (failedPosts.length > 0) {
      const failedFile = join(logsDir, `failed-posts-${Date.now()}.json`);
      await writeFile(failedFile, JSON.stringify(failedPosts, null, 2));
      log(`\n📝 Failed posts saved to: ${failedFile}`);
      
      log('\n🔧 Failed posts analysis:');
      const errorGroups = {};
      failedPosts.forEach(f => {
        const errorKey = f.error ? f.error.substring(0, 100) : 'Unknown error';
        errorGroups[errorKey] = (errorGroups[errorKey] || 0) + 1;
      });
      
      Object.entries(errorGroups).forEach(([error, count]) => {
        log(`   ${count} posts: ${error}`);
      });
      
      // Generate retry script
      const retryScript = `// Retry script for failed posts - ${new Date().toISOString()}
const failedPosts = ${JSON.stringify(failedPosts.map(f => f.post), null, 2)};

const INDEXNOW_KEY = '${INDEXNOW_KEY}';
const BASE_URL = '${BASE_URL}';

// Local helper inside retry script to build public url
function getPublicUrlForPost(post) {
  if (post.contentType === 'tutorial') return '${BASE_URL}/tutorials/' + post.slug;
  if (post.categories && post.categories.length > 0) {
    const withParent = post.categories.find(c => c.parent && c.parent.slug);
    if (withParent) return '${BASE_URL}/' + withParent.parent.slug + '/' + withParent.slug + '/' + post.slug;
    const newsLike = post.categories.find(c => ['news','world','business'].includes(c.slug));
    if (newsLike) return '${BASE_URL}/' + (newsLike.slug === 'world' ? 'news/world' : newsLike.slug === 'business' ? 'news/business' : 'news') + '/' + post.slug;
    return '${BASE_URL}/' + post.categories[0].slug + '/' + post.slug;
  }
  return '${BASE_URL}/blogs/' + post.slug;
}

async function submitDirectToIndexNow(post) {
  const host = 'www.geokhub.com';
  const url = getPublicUrlForPost(post);
  
  const payload = {
    host: host,
    key: INDEXNOW_KEY,
    keyLocation: \`https://\${host}/\${INDEXNOW_KEY}.txt\`,
    urlList: [url],
  };

  const endpoints = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
    'https://yandex.com/indexnow'
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(\`Trying: \${endpoint}\`);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (response.ok) {
        console.log(\`✅ Success: \${post.title}\`);
        return true;
      }
    } catch (error) {
      console.log(\`⚠️ \${endpoint} failed: \${error.message}\`);
    }
  }
  
  console.log(\`❌ All endpoints failed: \${post.title}\`);
  return false;
}

async function retryFailedPosts() {
  console.log(\`Retrying \${failedPosts.length} failed posts...\\n\`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < failedPosts.length; i++) {
    const post = failedPosts[i];
    console.log(\`\\n\${i + 1}/\${failedPosts.length}: \${post.title}\`);
    
    const result = await submitDirectToIndexNow(post);
    
    if (result) {
      successCount++;
    } else {
      errorCount++;
    }
    
    // Wait 500ms between requests
    if (i < failedPosts.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  console.log(\`\\n🎉 Retry completed: \${successCount} successful, \${errorCount} failed\`);
}

retryFailedPosts();
`;
      
      const retryFile = join(logsDir, 'retry-failed.js');
      await writeFile(retryFile, retryScript);
      log(`\n🔧 Retry script generated: ${retryFile}`);
      log(`   Run: node ${retryFile}`);
    }

    // Save summary
    const summary = {
      timestamp: new Date().toISOString(),
      totalPosts: allPosts.length,
      successCount,
      errorCount,
      successRate: ((successCount / allPosts.length) * 100).toFixed(1) + '%',
      successMethods,
      totalTimeMinutes: totalElapsedMinutes.toFixed(1),
      avgTimePerPost: avgTimePerPost,
      baseUrl: BASE_URL,
      keyFileAccessible: keyAccessible,
      apiConnected: isConnected
    };
    
    const summaryFile = join(logsDir, `summary-${Date.now()}.json`);
    await writeFile(summaryFile, JSON.stringify(summary, null, 2));
    log(`\n📄 Summary saved to: ${summaryFile}`);

    // Show completion message
    log('\n' + '='.repeat(60));
    if (errorCount === 0) {
      log('🎉 ALL POSTS SUBMITTED SUCCESSFULLY!');
    } else {
      log(`⚠️ ${errorCount} posts failed. Check ${join(logsDir, 'failed-posts-*.json')} for details.`);
    }
    log('='.repeat(60));

  } catch (error) {
    logError('\n💥 Bulk indexing failed:');
    logError(error.message);
    logError(error.stack);
  } finally {
    logStream.end();
    errorStream.end();
  }
}

// Quick test function
async function quickTest() {
  log('🧪 Running quick test...');
  
  // Test with a single post
  const testPost = {
    slug: 'test-post',
    title: 'Test Post',
    publishedAt: new Date().toISOString(),
    _type: 'post',
    _id: 'test-id',
    contentType: 'article'
  };

  log('Testing via API endpoint...');
  const apiResult = await submitPost(testPost, 0, 1);
  
  if (!apiResult.success) {
    log('Testing direct IndexNow submission...');
    const directResult = await submitDirectToIndexNow(testPost);
    log(`Direct result: ${JSON.stringify(directResult, null, 2)}`);
  }
}

// Choose mode
const mode = process.argv[2] || 'bulk';

async function main() {
  if (mode === 'test') {
    await quickTest();
  } else if (mode === 'check') {
    // Just check connectivity and key file
    await checkKeyFile();
    await testApiConnectivity();
  } else if (mode === 'direct') {
    // Test direct submission with a sample post
    const testPost = {
      slug: 'test-post',
      title: 'Test Post',
      contentType: 'article'
    };
    const result = await submitDirectToIndexNow(testPost);
    log(JSON.stringify(result, null, 2));
  } else {
    await bulkIndexSanityPosts();
  }
}

main()
  .then(() => {
    console.log("\n🏁 Script finished.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("\n💥 Script crashed:", err);
    process.exit(1);
  });
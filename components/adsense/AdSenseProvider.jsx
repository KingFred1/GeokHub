'use client';

import { GoogleAdSense } from '@next/third-parties/google';

export default function AdSenseProvider() {
  // AdSense Publisher ID
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
  
  if (!publisherId) {
    console.warn('AdSense Publisher ID not configured');
    return null;
  }

  return (
    <>
      <GoogleAdSense publisherId={publisherId} />
      
      {/* Consent Management for GDPR/CCPA compliance */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'analytics_storage': 'denied',
              'wait_for_update': 500
            });
            
            // Update consent if user accepts
            function acceptCookies() {
              gtag('consent', 'update', {
                'ad_storage': 'granted',
                'analytics_storage': 'granted'
              });
              localStorage.setItem('cookieConsent', 'granted');
            }
          `
        }}
      />
    </>
  );
}
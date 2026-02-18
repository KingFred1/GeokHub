'use client';

import Script from 'next/script';
import { useEffect } from 'react';

export default function AdSenseLoader() {
  useEffect(() => {
    // Wait for DOM and simulate AdSense
    const timer = setTimeout(() => {
      if (!window.adsbygoogle) {
        console.log('Creating adsbygoogle mock for development');
        window.adsbygoogle = window.adsbygoogle || [];
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (process.env.NODE_ENV === 'development') {
    // Don't load real AdSense in development
    return null;
  }

  const publisher = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || process.env.NEXT_PUBLIC_ADS_CLIENT_ID || '';
  const src = publisher
    ? `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisher}`
    : 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';

  return (
    <>
      <Script
        id="adsbygoogle-init"
        strategy="afterInteractive"
        crossOrigin="anonymous"
        src={src}
        onError={(e) => {
          console.error('AdSense script failed to load:', e);
        }}
      />
      <Script
        id="adsbygoogle-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Log AdSense-related errors instead of suppressing all global errors.
            window.addEventListener('error', function(e) {
              try {
                const msg = (e && e.message) || (e && e.error && e.error.message) || '';
                if (msg && (msg.includes('adsbygoogle') || msg.includes('doubleclick'))) {
                  console.warn('AdSense error:', msg);
                }
              } catch (ex) {
                // swallow logging errors
              }
            }, true);
          `,
        }}
      />
    </>
  );
}
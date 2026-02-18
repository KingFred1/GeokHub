'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default function AdSenseSafe() {
  useEffect(() => {
    // Load AdSense only on client side
    const loadAdSense = () => {
      try {
        const script = document.createElement('script');
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3588939653643864';
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.onload = () => {
          console.log('AdSense loaded successfully');
          // Initialize ads
          if (window.adsbygoogle) {
            try {
              (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
              console.warn('AdSense push failed:', e);
            }
          }
        };
        script.onerror = () => {
          console.warn('AdSense failed to load - this is OK');
        };
        document.head.appendChild(script);
      } catch (error) {
        console.warn('AdSense script error caught:', error);
      }
    };

    // Delay loading to prevent blocking
    const timer = setTimeout(loadAdSense, 1000);
    return () => clearTimeout(timer);
  }, []);

  return null; // This component doesn't render anything
}
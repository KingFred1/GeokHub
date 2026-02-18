'use client';

import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);
  
  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowConsent(true);
    } else if (consent === 'granted') {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('consent', 'update', {
          'ad_storage': 'granted',
          'analytics_storage': 'granted'
        });
      } else {
        console.warn('gtag not available when applying stored consent');
      }
    }
  }, []);
  
  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'granted');
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        'ad_storage': 'granted',
        'analytics_storage': 'granted'
      });
    } else {
      console.warn('gtag not available at acceptCookies');
    }
    setShowConsent(false);
  };
  
  const denyCookies = () => {
    localStorage.setItem('cookieConsent', 'denied');
    setShowConsent(false);
  };
  
  if (!showConsent) return null;
  
  return (
    <div className="cookie-consent-banner">
      <div className="cookie-content">
        <p>
          We use cookies and similar technologies to show relevant ads. 
          By clicking "Accept", you consent to the use of cookies for ads and analytics.
        </p>
        <div className="cookie-buttons">
          <button onClick={acceptCookies} className="cookie-accept">
            Accept
          </button>
          <button onClick={denyCookies} className="cookie-deny">
            Deny
          </button>
        </div>
      </div>
    </div>
  );
}
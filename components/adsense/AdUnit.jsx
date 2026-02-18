'use client';

import { useEffect, useRef } from 'react';

export default function AdUnit({
  adSlot,
  adFormat = 'auto',
  adStyle = { display: 'block' },
  layout,
  layoutKey,
  fullWidthResponsive = true,
  className = ''
}) {
  const adRef = useRef(null);
  
  useEffect(() => {
    // Ensure adsense script is loaded
    if (window.adsbygoogle && adRef.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }
  }, [adSlot]);
  
  // Don't show ads on development
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className={`ad-placeholder ${className}`} style={{
        backgroundColor: '#f0f0f0',
        border: '2px dashed #ccc',
        padding: '20px',
        textAlign: 'center',
        minHeight: adFormat === 'fluid' ? '100px' : '250px'
      }}>
        <p>Ad Unit: {adSlot}</p>
        <small>Ads hidden in development mode</small>
      </div>
    );
  }
  
  return (
    <div className={`ad-container ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={adStyle}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
        data-ad-layout={layout}
        data-ad-layout-key={layoutKey}
      />
    </div>
  );
}
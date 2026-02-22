'use client';

import { useEffect } from 'react';

export default function InlineArticleAd() {
  useEffect(() => {
    // Push ad config to adsbygoogle queue
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div className="my-8 flex justify-center">
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          textAlign: 'center',
        }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="ca-pub-3588939653643864"
        data-ad-slot="5785087096"
      />
    </div>
  );
}

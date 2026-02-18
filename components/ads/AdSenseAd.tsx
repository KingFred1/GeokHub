// "use client";

// import { useEffect } from 'react';

// interface AdSenseAdProps {
//   slot: string;
//   format?: string;
//   layout?: string;
//   responsive?: boolean;
//   className?: string;
//   size?: 'small' | 'medium' | 'large' | 'responsive';
// }

// export default function AdSenseAd({ 
//   slot, 
//   format = "auto", 
//   layout = "", 
//   responsive = true, 
//   className = "",
//   size = "responsive"
// }: AdSenseAdProps) {
//   useEffect(() => {
//     try {
//       ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
//     } catch (err) {
//       console.error('AdSense error:', err);
//     }
//   }, []);

//   // Set appropriate ad format based on size
//   const adFormat = size === 'small' ? 'rectangle' : format;

//   return (
//     <div className={`my-6 ${className}`}>
//       {/* Ad label for compliance */}
//       <div className="text-xs text-gray-500 mb-1 text-center">Advertisement</div>
      
//       {/* Actual ad container */}
//       <ins
//         className="adsbygoogle block"
//         style={{ display: 'block' }}
//         data-ad-client={process.env.NEXT_PUBLIC_ADS_CLIENT_ID}
//         data-ad-slot={slot}
//         data-ad-format={adFormat}
//         data-full-width-responsive={responsive.toString()}
//       />
//     </div>
//   );
// }